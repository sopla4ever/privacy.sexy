import { IScriptingDefinition } from '@/domain/IScriptingDefinition';
import { YamlScriptingDefinition } from 'js-yaml-loader!./application.yaml';
import { ScriptingDefinition } from '@/domain/ScriptingDefinition';
import { ScriptingLanguage } from '@/domain/ScriptingLanguage';
import { IProjectInformation } from '@/domain/IProjectInformation';

export function parseScriptingDefinition(
    file: YamlScriptingDefinition,
    info: IProjectInformation,
    date = new Date()): IScriptingDefinition {
    if (!info) {
        throw new Error('undefined info');
    }
    validateLanguage(file.language);
    const language = ScriptingLanguage[file.language as keyof typeof ScriptingLanguage];
    const startCode = applySubstitutions(file.startCode, info, date);
    const endCode = applySubstitutions(file.endCode, info, date);
    return new ScriptingDefinition(
        language,
        startCode,
        endCode,
    );
}

function validateLanguage(language: string) {
    if (!language) {
        throw new Error('undefined language');
    }
    if (!(language in ScriptingLanguage)) {
        throw new Error(`unknown language: ${language}`);
    }
}

function applySubstitutions(code: string, info: IProjectInformation, date: Date): string {
    code = code.replace('{{ homepage }}', info.homepage);
    code = code.replace('{{ version }}', info.version);
    code = code.replace('{{ date }}', date.toUTCString());
    return code;
}
