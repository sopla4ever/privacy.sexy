import { ScriptingLanguage } from './ScriptingLanguage';
import { IScriptingDefinition } from './IScriptingDefinition';

export class ScriptingDefinition implements IScriptingDefinition {
    public readonly fileExtension: string;
    constructor(
            public readonly language: ScriptingLanguage,
            public readonly startCode: string,
            public readonly endCode: string,
        ) {
        this.fileExtension = findExtension(language);
        validateCode(startCode);
        validateCode(endCode);
    }
}

function findExtension(language: ScriptingLanguage): string {
    switch (language) {
        case ScriptingLanguage.bash:
            return 'sh';
        case ScriptingLanguage.batchfile:
            return 'bat';
        default:
            throw new Error(`unsupported language: ${language}`);
    }
}

function validateCode(code: string) {
    if (!code) {
        throw new Error('start or end code is empty');
    }
}
