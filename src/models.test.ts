import {describe, it, expect} from 'vitest';
import Label from './models/Label';
import Comment from './models/Comment';
import Definition from './models/Definition';
import LegalDoc from './models/LegalDoc';
import Annotation from './models/Annotation';
import Relation from './models/Relation';

describe('Models test', () => {
    it('Label constructor', () => {
        const label = new Label(1, 'test', 'red');
        expect(label.labelId).toBe(1);
        expect(label.name).toBe('test');
        expect(label.color).toBe('red');
    });

    it('Comment constructor', () => {
        const comment = new Comment(1, 'test');
        expect(comment.commentId).toBe(1);
        expect(comment.comment).toBe('test');
        expect(comment.creationDate).toBeInstanceOf(Date);
    });

    it('Definition constructor', () => {
        const definition = new Definition(1, 'test');
        expect(definition.definitionId).toBe(1);
        expect(definition.definition).toBe('test');
        expect(definition.creationDate).toBeInstanceOf(Date);
    });

    it('LegalDoc constructor', () => {
        const legalDoc = new LegalDoc(1, 'test', 'test', []);
        expect(legalDoc.id).toBe(1);
        expect(legalDoc.text).toBe('test');
        expect(legalDoc.source).toBe('test');
        expect(legalDoc.annotations).toEqual([]);
    });

    it('Annotation constructor', () => {
        const legalDoc = new LegalDoc(1, 'test', 'test', []);
        const comment = new Comment(1, 'test');
        const definition = new Definition(1, 'test');
        const annotation = new Annotation(1, legalDoc, 'test', 'test', comment, definition);
        expect(annotation.id).toBe(1);
        expect(annotation.parent).toBe(legalDoc);
        expect(annotation.text).toBe('test');
        expect(annotation.label).toBe('test');
        expect(annotation.comment).toBe(comment);
        expect(annotation.definition).toBe(definition);
    });

    it('Relation constructor', () => {
        const label1 = new Label(1, 'test', 'red');
        const label2 = new Label(2, 'test', 'red');
        const relation = new Relation(1, label1, label2, 'test');

        expect(relation.relationId).toBe(1);
        expect(relation.label1).toBe(label1);
        expect(relation.label2).toBe(label2);
        expect(relation.description).toBe('test');
    });
});