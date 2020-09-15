declare module 'js-yaml-loader!*' {
    export type CategoryOrScript = YamlCategory | YamlScript;
    export type DocumentationUrls = ReadonlyArray<string> | string;

    export interface YamlDocumentable {
        docs?: DocumentationUrls;
    }

    export interface YamlFunction {
        name: string;
        parameters: readonly string[];
        code: string;
        revertCode: string;
    }
    interface ICallDictionary {
        [index:string]: string;
    }
    export interface YamlCall {
        function: string;
        parameters: readonly ICallDictionary[];
    }

    export interface YamlScript extends YamlDocumentable {
        name: string;
        code: string | undefined;
        revertCode: string | undefined;
        call: readonly YamlCall[] | YamlCall | undefined;
        recommend: boolean;
    }

    export interface YamlCategory extends YamlDocumentable {
        children: ReadonlyArray<CategoryOrScript>;
        category: string;
    }

    export interface ApplicationYaml {
        name: string;
        repositoryUrl: string;
        actions: ReadonlyArray<YamlCategory>;
        functions: ReadonlyArray<YamlFunction> | undefined;
    }

    const content: ApplicationYaml;
    export default content;
}
