import { Script } from '@/domain/Script';
import { YamlScript } from 'js-yaml-loader!./application.yaml';
import { parseDocUrls } from './DocumentationParser';
import { IScriptCompiler } from './Function/IScriptCompiler';
import { IScriptCode } from '../../domain/IScriptCode';
import { ScriptCode } from '../../domain/ScriptCode';

export function parseScript(yamlScript: YamlScript, compiler: IScriptCompiler): Script {
    if (!yamlScript) {
        throw new Error('undefined script');
    }
    if (!compiler) {
        throw new Error('undefined compiler');
    }
    const script = new Script(
        /* name */              yamlScript.name,
        /* code */              parseCode(yamlScript, compiler),
        /* docs */              parseDocUrls(yamlScript),
        /* isRecommended */     yamlScript.recommend);
    return script;
}

function parseCode(yamlScript: YamlScript, compiler: IScriptCompiler): IScriptCode {
    if (compiler.canCompile(yamlScript)) {
        return compiler.compile(yamlScript);
    }
    return new ScriptCode(yamlScript.name, yamlScript.code, yamlScript.revertCode);
}
