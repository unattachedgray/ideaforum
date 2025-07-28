import DataLoader from 'dataloader';
import { User, Document, Section, SectionVersion, Vote } from '@shared/types';
import { UserModel } from '../models/UserModel';
import { DocumentModel } from '../models/DocumentModel';
import { SectionModel } from '../models/SectionModel';
import { VoteModel } from '../models/VoteModel';
import { keyBy } from 'lodash';

export interface DataLoaders {
  userLoader: DataLoader<string, User | null>;
  documentLoader: DataLoader<string, Document | null>;
  sectionLoader: DataLoader<string, Section | null>;
  documentsByAuthorLoader: DataLoader<string, Document[]>;
  sectionsByAuthorLoader: DataLoader<string, Section[]>;
  sectionsByDocumentLoader: DataLoader<string, Section[]>;
  versionsBySectionLoader: DataLoader<string, SectionVersion[]>;
  votesByUserLoader: DataLoader<string, Vote[]>;
  votesBySectionLoader: DataLoader<string, Vote[]>;
}

export function createDataLoaders(): DataLoaders {
  return {
    userLoader: new DataLoader<string, User | null>(async (ids) => {
      const users = await UserModel.getByIds(ids as string[]);
      const usersById = keyBy(users, 'id');
      return ids.map((id) => usersById[id] || null);
    }),
    documentLoader: new DataLoader<string, Document | null>(async (ids) => {
      const documents = await DocumentModel.getByIds(ids as string[]);
      const documentsById = keyBy(documents, 'id');
      return ids.map((id) => documentsById[id] || null);
    }),
    sectionLoader: new DataLoader<string, Section | null>(async (ids) => {
      const sections = await SectionModel.getByIds(ids as string[]);
      const sectionsById = keyBy(sections, 'id');
      return ids.map((id) => sectionsById[id] || null);
    }),
    documentsByAuthorLoader: new DataLoader<string, Document[]>(async (authorIds) => {
      const documents = await DocumentModel.getByAuthorIds(authorIds as string[]);
      const documentsByAuthorId: { [key: string]: Document[] } = {};
      documents.forEach(doc => {
        if (!documentsByAuthorId[doc.authorId]) {
          documentsByAuthorId[doc.authorId] = [];
        }
        documentsByAuthorId[doc.authorId].push(doc);
      });
      return authorIds.map((id) => documentsByAuthorId[id] || []);
    }),
    sectionsByAuthorLoader: new DataLoader<string, Section[]>(async (authorIds) => {
      const sections = await SectionModel.getByAuthorIds(authorIds as string[]);
      const sectionsByAuthorId: { [key: string]: Section[] } = {};
      sections.forEach(section => {
        if (!sectionsByAuthorId[section.authorId]) {
          sectionsByAuthorId[section.authorId] = [];
        }
        sectionsByAuthorId[section.authorId].push(section);
      });
      return authorIds.map((id) => sectionsByAuthorId[id] || []);
    }),
    sectionsByDocumentLoader: new DataLoader<string, Section[]>(async (documentIds) => {
      const sections = await SectionModel.getByDocumentIds(documentIds as string[]);
      const sectionsByDocumentId: { [key: string]: Section[] } = {};
      sections.forEach(section => {
        if (!sectionsByDocumentId[section.documentId]) {
          sectionsByDocumentId[section.documentId] = [];
        }
        sectionsByDocumentId[section.documentId].push(section);
      });
      return documentIds.map((id) => sectionsByDocumentId[id] || []);
    }),
    versionsBySectionLoader: new DataLoader<string, SectionVersion[]>(async (sectionIds) => {
      // This model method needs to be implemented
      // const versions = await SectionVersionModel.getBySectionIds(sectionIds as string[]);
      const versions: SectionVersion[] = []; // Placeholder
      const versionsBySectionId: { [key: string]: SectionVersion[] } = {};
      versions.forEach(version => {
        if (!versionsBySectionId[version.sectionId]) {
          versionsBySectionId[version.sectionId] = [];
        }
        versionsBySectionId[version.sectionId].push(version);
      });
      return sectionIds.map((id) => versionsBySectionId[id] || []);
    }),
    votesByUserLoader: new DataLoader<string, Vote[]>(async (userIds) => {
      const votes = await VoteModel.getByUserIds(userIds as string[]);
      const votesByUserId: { [key: string]: Vote[] } = {};
      votes.forEach(vote => {
        if (!votesByUserId[vote.userId]) {
          votesByUserId[vote.userId] = [];
        }
        votesByUserId[vote.userId].push(vote);
      });
      return userIds.map((id) => votesByUserId[id] || []);
    }),
    votesBySectionLoader: new DataLoader<string, Vote[]>(async (sectionIds) => {
      const votes = await VoteModel.getBySectionIds(sectionIds as string[]);
      const votesBySectionId: { [key: string]: Vote[] } = {};
      votes.forEach(vote => {
        if (!votesBySectionId[vote.sectionId]) {
          votesBySectionId[vote.sectionId] = [];
        }
        votesBySectionId[vote.sectionId].push(vote);
      });
      return sectionIds.map((id) => votesBySectionId[id] || []);
    }),
  };
}
