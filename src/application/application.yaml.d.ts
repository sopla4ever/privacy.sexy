declare module 'js-yaml-loader!*' {
    export type CategoryOrScript = YamlCategory | YamlScript;
    export type DocumentationUrls = ReadonlyArray<string> | string;

    export interface YamlDocumentable {
        readonly docs?: DocumentationUrls;
    }

    export interface YamlScript extends YamlDocumentable {
        readonly name: string;
        readonly code: string;
        readonly revertCode: string;
        readonly recommend: boolean;
    }

    export interface YamlCategory extends YamlDocumentable {
        readonly children: ReadonlyArray<CategoryOrScript>;
        readonly category: string;
    }

    export interface YamlScriptingDefinition {
        language: string;
        fileExtension: string;
        startCode: string;
        endCode: string;
    }

    export interface YamlApplication {
        readonly os: string;
        readonly scripting: YamlScriptingDefinition;
        readonly actions: ReadonlyArray<YamlCategory>;
    }

    const content: YamlApplication;
    export default content;
}
