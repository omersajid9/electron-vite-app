import { ChangeEvent, cloneElement } from "react"
import { CollectionSchema, TypesenseClient } from "../types/typesense"

import mongoDB, { MongoClient } from 'mongodb'
import Typesense from 'typesense'
import { SearchParams } from "typesense/lib/Typesense/Documents"


interface FormData
{
  key: string,
  value: string,
  variableData: VariableData[]
}

interface VariableData
{
  varName: string,
  index: number,
  text: string
}


let schema: CollectionSchema = {
    name: 'keyvalues',
    enable_nested_fields: true,
    fields: [
      {
        name: 'key',
        type: 'string',
        facet: false,
      },
      {
        name: 'value',
        type: 'string',
        facet: false,
      },
      {
        name: 'variableData',
        type: 'object[]',
        facet: false,
      }
    ]
  }


  
  const typesense = new Typesense.Client({
      nodes: [
        {
          host: 'f08w5q6prysg7kojp-1.a1.typesense.net',
          port: 443,
          protocol: 'https',
        },
      ],
      // Todo add env to store api keys
      apiKey: 'iw5IavWe2ur7rMtkgQcAEn4iOnd3MvRv',
      connectionTimeoutSeconds: 60*60,
    })  
  
    async function createSchema(schema: CollectionSchema, typesense: any) {
      const collectionsList = await typesense.collections().retrieve()
      var toCreate = collectionsList.find((value: any) => {
        return value['name'] == schema['name']
      })
    
      if (!toCreate) {
        await typesense.collections().create(schema)
      }
    }
  
    createSchema(schema, typesense)
  
  export const insertDocumentT = (doc: FormData) =>
  {
      const keyValue: FormData = 
      {
          key: doc.key,
          value: doc.value,
          variableData: doc.variableData
      };
      typesense.collections("keyvalues").documents().create(keyValue);
  }
    
  export const searchDocumentT = (query: string) =>
  {
      const searchParams: SearchParams = 
      {
          q: query,
          query_by: 'key,value',
          text_match_type: 'max_weight',
          sort_by: '_text_match:desc',
          split_join_tokens: 'always'
      }
      return typesense.collections("keyvalues").documents().search(searchParams)
  }
  
  