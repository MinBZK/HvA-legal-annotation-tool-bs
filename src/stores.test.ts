import {describe, it, expect} from 'vitest';
import {relationsStore, labelStore, relationsTextStore} from './stores/relationStore';

describe('Stores test', () => {
    it('relationsStore test', () => {
        let relations;

        relationsStore.subscribe((value) => {
            relations = value;
        });

        expect(relations).toEqual([
            {
                relationId: 1,
                label1: { labelId: 1, name: 'Label1', color: 'blue' },
                label2: { labelId: 2, name: 'Label2', color: 'blue' },
                description: 'Wie heeft het recht'
            },
            {
                relationId: 2,
                label1: { labelId: 1, name: 'Label1', color: 'blue' },
                label2: { labelId: 3, name: 'Label3', color: 'blue' },
                description: 'Wie heeft de plicht'
            },
            {
                relationId: 3,
                label1: { labelId: 1, name: 'Label1', color: 'blue' },
                label2: { labelId: 4, name: 'Label4', color: 'blue' },
                description: 'Heeft als voorwerp'
            },
            {
                relationId: 4,
                label1: { labelId: 2, name: 'Label2', color: 'blue' },
                label2: { labelId: 5, name: 'Label5', color: 'green' },
                description: 'Wordt gecreëerd door'
            }
        ]);
    });

    it('labelStore test', () => {
        let labels;

        labelStore.subscribe((value) => {
            labels = value;
        });

        expect(labels).toEqual([
            { labelId: 1, name: 'Label1', color: 'blue' },
            { labelId: 2, name: 'Label2', color: 'blue' },
            { labelId: 3, name: 'Label3', color: 'blue' },
            { labelId: 4, name: 'Label4', color: 'blue' },
            { labelId: 5, name: 'Label5', color: 'green' }
        ]);
    });

    it('relationsTextStore test', () => {
        let relationsText;

        relationsTextStore.subscribe((value) => {
            relationsText = value;
        });

        expect(relationsText).toEqual([
            'Wie heeft het recht',
            'Wie heeft de plicht',
            'Heeft als voorwerp',
            'Wordt gecreëerd door',
            'Wordt gewijzigd door',
            'Wordt beëindigd door',
            'Is geldig indien voldaan aan',
            'Wordt uitgevoerd door',
            'Vindt plaats op',
            'Vindt plaats in',
            'Is specalisatie van',
            'Heeft als invoer',
            'Heeft als uitvoer',
            'Gebruikt'
        ]);
    });
});