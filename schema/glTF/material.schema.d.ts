/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The material appearance of a primitive.
 */
export type Material = ChildOfAGlTFRootProperty;
export type ChildOfAGlTFRootProperty = GlTFProperty;

export interface GlTFProperty {
  extensions?: Extension;
  extras?: Extras;
  [k: string]: any;
}
/**
 * Dictionary object with extension-specific objects.
 */
export interface Extension {
  [k: string]: {
    [k: string]: any;
  };
}
/**
 * Application-specific data.
 */
export interface Extras {
  [k: string]: any;
}