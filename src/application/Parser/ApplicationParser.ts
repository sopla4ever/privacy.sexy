import { Category } from '@/domain/Category';
import { Application } from '@/domain/Application';
import { IApplication } from '@/domain/IApplication';
import { YamlApplication } from 'js-yaml-loader!./../application.yaml';
import { parseCategory } from './CategoryParser';
import { OperatingSystem } from '@/domain/OperatingSystem';
import { parseScriptingDefinition } from './ScriptingDefinitionParser';
import { parseProjectInformation } from './ProjectInformationParser';

export function parseApplication(
    content: YamlApplication): IApplication {
    validate(content);
    const categories = new Array<Category>();
    for (const action of content.actions) {
        const category = parseCategory(action);
        categories.push(category);
    }
    const os = OperatingSystem[content.os as keyof typeof OperatingSystem];
    const info = parseProjectInformation(process.env);
    const scripting = parseScriptingDefinition(content.scripting, info);
    const app = new Application(
        os,
        info,
        categories,
        scripting);
    return app;
}

function validate(content: YamlApplication): void {
    if (!content) {
        throw new Error('application is null or undefined');
    }
    if (!content.actions || content.actions.length <= 0) {
        throw new Error('application does not define any action');
    }
}
