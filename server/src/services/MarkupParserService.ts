import { MarkupBlock, ParsedContent } from '../types/shared';

interface ContentMetadata {
  wikiVisibility: boolean;
  consensusLevel?: number;
  debateStatus?: 'active' | 'resolved' | 'contested';
  synthesisSource?: string[];
  promotionVotes: number;
}

export class MarkupParserService {
  private static readonly SEMANTIC_TAG_PATTERNS = {
    consensus: /\[!consensus:\s*(\d+(?:\.\d+)?)%?\](.*?)\[!end-consensus\]/gs,
    debate: /\[!debate-active:\s*([^\]]+)\](.*?)\[!end-debate\]/gs,
    synthesis: /\[!synthesis\s+from:\s*([^\]]+)\](.*?)\[!end-synthesis\]/gs,
    wikiPrimary: /\[!wiki-primary\](.*?)\[!end-wiki-primary\]/gs,
    threadOnly: /\[!thread-only\](.*?)\[!end-thread-only\]/gs,
    logicError: /\[!logic-error:\s*([^\]]+)\](.*?)\[!end-logic-error\]/gs
  };

  /**
   * Parse content with semantic markup tags
   */
  static parseContent(content: string): ParsedContent {
    const blocks: MarkupBlock[] = [];
    let plainText = content;
    let metadata: ContentMetadata = {
      wikiVisibility: true,
      promotionVotes: 0
    };

    // Parse consensus blocks
    let match;
    while ((match = this.SEMANTIC_TAG_PATTERNS.consensus.exec(content)) !== null) {
      const consensusLevel = parseFloat(match[1]) / 100;
      const blockContent = match[2].trim();
      
      blocks.push({
        type: 'consensus',
        content: blockContent,
        attributes: { consensusLevel },
        startPosition: match.index,
        endPosition: match.index + match[0].length
      });

      // Update metadata
      if (consensusLevel > (metadata.consensusLevel || 0)) {
        metadata.consensusLevel = consensusLevel;
      }

      // Remove markup from plain text
      plainText = plainText.replace(match[0], blockContent);
    }

    // Reset regex lastIndex for reuse
    this.SEMANTIC_TAG_PATTERNS.consensus.lastIndex = 0;

    // Parse debate blocks
    while ((match = this.SEMANTIC_TAG_PATTERNS.debate.exec(content)) !== null) {
      const debateTopic = match[1].trim();
      const blockContent = match[2].trim();
      
      blocks.push({
        type: 'debate',
        content: blockContent,
        attributes: { debateTopic, status: 'active' },
        startPosition: match.index,
        endPosition: match.index + match[0].length
      });

      metadata.debateStatus = 'active';
      plainText = plainText.replace(match[0], blockContent);
    }

    this.SEMANTIC_TAG_PATTERNS.debate.lastIndex = 0;

    // Parse synthesis blocks
    while ((match = this.SEMANTIC_TAG_PATTERNS.synthesis.exec(content)) !== null) {
      const sources = match[1].split(',').map(s => s.trim());
      const blockContent = match[2].trim();
      
      blocks.push({
        type: 'synthesis',
        content: blockContent,
        attributes: { sources },
        startPosition: match.index,
        endPosition: match.index + match[0].length
      });

      metadata.synthesisSource = sources;
      plainText = plainText.replace(match[0], blockContent);
    }

    this.SEMANTIC_TAG_PATTERNS.synthesis.lastIndex = 0;

    // Parse wiki-primary blocks
    while ((match = this.SEMANTIC_TAG_PATTERNS.wikiPrimary.exec(content)) !== null) {
      const blockContent = match[1].trim();
      
      blocks.push({
        type: 'wiki-primary',
        content: blockContent,
        attributes: { priority: 'high' },
        startPosition: match.index,
        endPosition: match.index + match[0].length
      });

      plainText = plainText.replace(match[0], blockContent);
    }

    this.SEMANTIC_TAG_PATTERNS.wikiPrimary.lastIndex = 0;

    // Parse thread-only blocks
    while ((match = this.SEMANTIC_TAG_PATTERNS.threadOnly.exec(content)) !== null) {
      const blockContent = match[1].trim();
      
      blocks.push({
        type: 'thread-only',
        content: blockContent,
        attributes: { visibility: 'thread' },
        startPosition: match.index,
        endPosition: match.index + match[0].length
      });

      // Thread-only content should not appear in wiki view
      metadata.wikiVisibility = blocks.some(b => b.type === 'wiki-primary' || b.type === 'consensus');
      plainText = plainText.replace(match[0], blockContent);
    }

    this.SEMANTIC_TAG_PATTERNS.threadOnly.lastIndex = 0;

    // If no blocks found, treat entire content as general content
    if (blocks.length === 0) {
      blocks.push({
        type: 'wiki-primary',
        content: content.trim(),
        attributes: {},
        startPosition: 0,
        endPosition: content.length
      });
    }

    return {
      blocks,
      plainText: plainText.trim(),
      metadata
    };
  }

  /**
   * Render content for specific view mode
   */
  static renderForView(blocks: MarkupBlock[], viewMode: 'thread' | 'wiki'): string {
    const relevantBlocks = blocks.filter(block => {
      if (viewMode === 'wiki') {
        // In wiki view, exclude thread-only content
        return block.type !== 'thread-only';
      } else {
        // In thread view, include all content
        return true;
      }
    });

    if (viewMode === 'wiki') {
      // Sort blocks by importance for wiki view
      relevantBlocks.sort((a, b) => {
        const priority: Record<string, number> = {
          'consensus': 4,
          'synthesis': 3,
          'wiki-primary': 2,
          'debate': 1,
          'thread-only': 0
        };
        return (priority[b.type] || 0) - (priority[a.type] || 0);
      });
    }

    return relevantBlocks.map(block => {
      let rendered = block.content;

      // Add view-specific decorations
      if (viewMode === 'wiki' && block.attributes) {
        switch (block.type) {
          case 'consensus':
            const consensusLevel = Math.round((block.attributes.consensusLevel || 0) * 100);
            rendered = `**[Consensus: ${consensusLevel}%]**\\n\\n${rendered}`;
            break;
          case 'synthesis':
            const sources = block.attributes.sources || [];
            if (Array.isArray(sources)) {
              rendered = `**[Synthesized from: ${sources.join(', ')}]**\\n\\n${rendered}`;
            }
            break;
          case 'debate':
            rendered = `**[Active Debate: ${block.attributes.debateTopic}]**\\n\\n${rendered}`;
            break;
        }
      }

      return rendered;
    }).join('\\n\\n');
  }

  /**
   * Extract metadata from parsed content
   */
  static extractMetadata(blocks: MarkupBlock[]): any {
    const metadata: any = {
      hasConsensus: false,
      hasActiveDebate: false,
      hasSynthesis: false,
      wikiReady: false
    };

    blocks.forEach(block => {
      if (!block.attributes) return;
      
      switch (block.type) {
        case 'consensus':
          metadata.hasConsensus = true;
          metadata.consensusLevel = block.attributes.consensusLevel;
          break;
        case 'debate':
          metadata.hasActiveDebate = true;
          metadata.debateTopics = metadata.debateTopics || [];
          metadata.debateTopics.push(block.attributes.debateTopic);
          break;
        case 'synthesis':
          metadata.hasSynthesis = true;
          metadata.synthesisSource = block.attributes.sources;
          break;
        case 'wiki-primary':
          metadata.wikiReady = true;
          break;
      }
    });

    return metadata;
  }

  /**
   * Validate markup syntax
   */
  static validateMarkup(content: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check for unclosed tags
    const tagPairs = [
      ['[!consensus:', '[!end-consensus]'],
      ['[!debate-active:', '[!end-debate]'],
      ['[!synthesis', '[!end-synthesis]'],
      ['[!wiki-primary]', '[!end-wiki-primary]'],
      ['[!thread-only]', '[!end-thread-only]'],
      ['[!logic-error:', '[!end-logic-error]']
    ];

    tagPairs.forEach(([openTag, closeTag]) => {
      const openMatches = content.match(new RegExp(openTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'))?.length || 0;
      const closeMatches = content.match(new RegExp(closeTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'))?.length || 0;
      
      if (openMatches !== closeMatches) {
        errors.push(`Mismatched tags: ${openTag} (${openMatches}) and ${closeTag} (${closeMatches})`);
      }
    });

    // Check consensus percentage format
    const consensusMatches = content.match(/\[!consensus:\s*(\d+(?:\.\d+)?)%?\]/g);
    if (consensusMatches) {
      consensusMatches.forEach(match => {
        const percentage = parseFloat(match.match(/(\d+(?:\.\d+)?)/)?.[1] || '0');
        if (percentage < 0 || percentage > 100) {
          errors.push(`Invalid consensus percentage: ${percentage}% (must be 0-100)`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Convert plain text to basic markup
   */
  static convertToMarkup(plainText: string, options: { makeWikiPrimary: boolean } = { makeWikiPrimary: false }): string {
    if (options.makeWikiPrimary) {
      return `[!wiki-primary]\n${plainText}\n[!end-wiki-primary]`;
    }
    return plainText;
  }

  /**
   * Strip all markup tags and return plain text
   */
  static stripMarkup(content: string): string {
    let stripped = content;
    
    Object.values(this.SEMANTIC_TAG_PATTERNS).forEach(pattern => {
      pattern.lastIndex = 0; // Reset regex
      stripped = stripped.replace(pattern, '$2'); // Keep content, remove tags
    });

    return stripped.trim();
  }
}
