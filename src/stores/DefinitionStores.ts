import {writable, type Writable} from "svelte/store";
import  Definition from "../models/Definition";


const initialDefinition = Definition.createEmpty();

export const definition = writable(initialDefinition);
// List of defition
export const definitionList = writable([] as Definition[]);

// Add defition to list
export const addDefinitionToList = (defition: Definition) =>{
    definitionList.update((definitions: Definition[])=>[...definitions,defition]);
}


// Update defition
export const updateDefinitionToList = (updateDefinition: Definition) =>{
    definitionList.update((defitions)=>{
        return defitions.map((definition)=>{
            // Check if the current defition matches the updated defition
            if(definition.definitionId === updateDefinition.definitionId){
                // If yes, update the defition with the new data
                return {...definition, ...updateDefinition};
            }
            // If not, return the original definition unchanged
            return definition;
        })
    })
}


// Remove defition
export const removeDefinitionFromList = (definition: Definition)=>{
    definitionList.update((definitions)=> definitions.filter((c)=> c !== definition));
}