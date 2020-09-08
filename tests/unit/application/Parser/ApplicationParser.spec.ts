import { IEntity } from '@/infrastructure/Entity/IEntity';
import applicationFile, { YamlCategory, YamlScript, YamlApplication, YamlScriptingDefinition } from 'js-yaml-loader!@/application/application.yaml';
import { parseApplication } from '@/application/Parser/ApplicationParser';
import 'mocha';
import { expect } from 'chai';
import { parseCategory } from '@/application/Parser/CategoryParser';
import { parseProjectInformation } from '@/application/Parser/ProjectInformationParser';
import { OperatingSystem } from '@/domain/OperatingSystem';
import { ScriptingLanguage } from '@/domain/ScriptingLanguage';
import { parseScriptingDefinition } from '@/application/Parser/ScriptingDefinitionParser';

describe('ApplicationParser', () => {
    describe('parseApplication', () => {
        it('can parse current application file', () => {
            expect(() => parseApplication(applicationFile)).to.not.throw();
        });
        it('throws when undefined', () => {
            // arrange
            const app = undefined;
            // act
            const act = () => parseApplication(app);
            // assert
            expect(act).to.throw('application is null or undefined');
        });
        describe('actions', () => {
            it('throws when undefined actions', () => {
                // arrange
                const app = new YamlApplicationBuilder().withActions(undefined).build();
                // act
                const act = () => parseApplication(app);
                // assert
                expect(act).to.throw('application does not define any action');
            });
            it('throws when has no actions', () => {
                // arrange
                const app = new YamlApplicationBuilder().withActions([]).build();
                // act
                const act = () => parseApplication(app);
                // assert
                expect(act).to.throw('application does not define any action');
            });
            it('parses actions', () => {
                // arrange
                const actions = [ getTestCategory('test1'), getTestCategory('test2') ];
                const expected = [ parseCategory(actions[0]), parseCategory(actions[1]) ];
                const app = new YamlApplicationBuilder().withActions(actions).build();
                // act
                const actual = parseApplication(app).actions;
                // assert
                expect(excludingId(actual)).to.be.deep.equal(excludingId(expected));
                function excludingId<TId>(array: ReadonlyArray<IEntity<TId>>) {
                    return array.map((obj) => {
                        const { ['id']: omitted, ...rest } = obj;
                        return rest;
                    });
                }
            });
        });
        describe('info', () => {
            it('returns process defaults as expected', () => {
                // arrange
                const expected = parseProjectInformation(process.env);
                const app = new YamlApplicationBuilder().build();
                // act
                const actual = parseApplication(app).info;
                // assert
                expect(actual).to.deep.equal(expected);
            });
        });
        it('parses scripting definition as expected', () => {
            // arrange
            const app = new YamlApplicationBuilder().build();
            const information = parseProjectInformation(process.env);
            const expected = parseScriptingDefinition(app.scripting, information);
            // act
            const actual = parseApplication(app);
            // assert
            expect(expected).to.deep.equal(actual);
        });
        describe('os', () => {
            it('sets os as expected', () => {
                // arrange
                const os = 'macOS';
                const expected = OperatingSystem.macOS;
                const app = new YamlApplicationBuilder().withOs(os).build();
                // act
                const actual = parseApplication(app).os;
                // assert
                expect(actual).to.equal(expected);
            });
            it('throws when os is invalid', () => {
                // arrange
                const os = 'TempleOS';
                const app = new YamlApplicationBuilder().withOs(os).build();
                // act
                const act = () => parseApplication(app);
                // assert
                expect(act).to.throw('unsupported os');
            });
        });
    });
});

function getTestDefinition(): YamlScriptingDefinition {
    return {
        fileExtension: '.bat',
        language: ScriptingLanguage.batchfile[ScriptingLanguage.batchfile],
        startCode: 'start',
        endCode: 'end',
    };
}

class YamlApplicationBuilder {
    private os = 'windows';
    private actions: readonly YamlCategory[] = [ getTestCategory() ];
    private scripting: YamlScriptingDefinition = getTestDefinition();

    public withActions(actions: readonly YamlCategory[]): YamlApplicationBuilder {
        this.actions = actions;
        return this;
    }

    public withOs(os: string): YamlApplicationBuilder {
        this.os = os;
        return this;
    }

    public withScripting(scripting: YamlScriptingDefinition): YamlApplicationBuilder {
        this.scripting = scripting;
        return this;
    }

    public build(): YamlApplication {
        return { os: this.os, scripting: this.scripting, actions: this.actions };
    }
}

function getTestCategory(scriptName = 'testScript'): YamlCategory {
    return {
        category: 'category name',
        children: [ getTestScript(scriptName) ],
    };
}

function getTestScript(scriptName: string): YamlScript {
    return {
        name: scriptName,
        code: 'script code',
        revertCode: 'revert code',
        recommend: true,
    };
}
