import { IScriptCode } from '@/domain/IScriptCode';
import { ScriptCode } from '@/domain/ScriptCode';
import { YamlScript, YamlFunction, YamlCall } from 'js-yaml-loader!./application.yaml';
import { IScriptCompiler } from './IScriptCompiler';

export class ScriptCompiler implements IScriptCompiler {
    constructor(private readonly functions: readonly YamlFunction[]) {
    }
    public canCompile(script: YamlScript): boolean {
        if (!script.call) {
            return false;
        }
        return true;
    }
    public compile(script: YamlScript): IScriptCode {
        if (!this.functions) {
            throw new Error('no registered functions');
        }
        if (typeof script.call !== 'object') {
            throw new Error('called function(s) must be an object');
        }
        const scriptCode = {
            code: '',
            revertCode: '',
        };
        const calls = script.call instanceof Array ? (script.call as YamlCall[]) : [ script.call as YamlCall ];
        for (let currentCallIndex = 0; currentCallIndex < calls.length; currentCallIndex++) {
            const currentCall = calls[currentCallIndex];
            const commonFunction = this.functions.find((f) => f.name === currentCall.function);
            if (!commonFunction) {
                throw new Error(`Used function is not defined "${currentCall.function}". Script: ${JSON.stringify(script)}`);
            }
            const callCode = {
                code: commonFunction.code,
                revertCode: commonFunction.revertCode,
            };
            for (const parameterName of commonFunction.parameters) {
                const parameterValue = currentCall.parameters[parameterName];
                callCode.code = substituteParameter(callCode.code, parameterName, parameterValue);
                callCode.revertCode = substituteParameter(callCode.revertCode, parameterName, parameterValue);
            }
            if (currentCallIndex !== calls.length - 1) {
                if (callCode.code) {
                    callCode.code += '\n';
                }
                if (callCode.revertCode) {
                    callCode.revertCode += '\n';
                }
            }
            scriptCode.code += callCode.code;
            scriptCode.revertCode += callCode.revertCode;
        }
        return new ScriptCode(script.name, scriptCode.code, scriptCode.revertCode);
    }
}

function substituteParameter(code: string, parameterName: string, parameterValue: string): string {
    code = code.replace(`{{ $${parameterName} }}`, parameterValue);
    return code;
}
