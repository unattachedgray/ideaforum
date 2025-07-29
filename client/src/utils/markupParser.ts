// Client-side markup parser utility
interface MarkupBlock {
  type: 'wiki-primary' | 'thread-only' | 'consensus' | 'debate' | 'synthesis';
  content: string;
  attributes?: Record<string, any>;
  startPosition: number;
  endPosition: number;
}

interface ParsedContent {
  blocks: MarkupBlock[];
  plainText: string;
  metadata?: any;
}

export class ClientMarkupParser {
  private static readonly SEMANTIC_TAG_PATTERNS = {
    consensus: /\[!consensus:\s*(\d+(?:\.\d+)?)%?\]([\s\S]*?)\[!end-consensus\]/g,
    debate: /\[!debate-active:\s*([^\]]+)\]([\s\S]*?)\[!end-debate\]/g,
    synthesis: /\[!synthesis\s+from:\s*([^\]]+)\]([\s\S]*?)\[!end-synthesis\]/g,
    wikiPrimary: /\[!wiki-primary\]([\s\S]*?)\[!end-wiki-primary\]/g,
    threadOnly: /\[!thread-only\]([\s\S]*?)\[!end-thread-only\]/g,
    logicError: /\[!logic-error:\s*([^\]]+)\]([\s\S]*?)\[!end-logic-error\]/g
  };

  /**
   * Parse content with semantic markup tags
   */
  static parseContent(content: string): ParsedContent {
    const blocks: MarkupBlock[] = [];
    let plainText = content;
    let metadata: any = {
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

      if (consensusLevel > (metadata.consensusLevel || 0)) {
        metadata.consensusLevel = consensusLevel;
      }

      plainText = plainText.replace(match[0], blockContent);
    }

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

      plainText = plainText.replace(match[0], blockContent);
    }

    this.SEMANTIC_TAG_PATTERNS.threadOnly.lastIndex = 0;

    // If no blocks found, treat entire content as general content (visible in both views)
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
  static renderForView(blocks: MarkupBlock[], viewMode: 'thread' | 'wiki'): MarkupBlock[] {
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

    return relevantBlocks;
  }

  /**
   * Check if content should be visible in wiki view
   */
  static isWikiVisible(blocks: MarkupBlock[]): boolean {
    return blocks.some(block => 
      block.type === 'wiki-primary' || 
      block.type === 'consensus' || 
      block.type === 'synthesis'
    );
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
}
