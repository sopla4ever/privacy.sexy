import { ScriptStub } from './../stubs/ScriptStub';
import { CategoryStub } from './../stubs/CategoryStub';
import { Application } from '@/domain/Application';
import 'mocha';
import { expect } from 'chai';
import { ProjectInformation } from '@/domain/ProjectInformation';
import { IProjectInformation } from '@/domain/IProjectInformation';
import { ICategory } from '@/domain/IApplication';
import { OperatingSystem } from '@/domain/OperatingSystem';
import { IScriptingDefinition } from '@/domain/IScriptingDefinition';
import { ScriptingLanguage } from '@/domain/ScriptingLanguage';

describe('Application', () => {
    it('getRecommendedScripts returns as expected', () => {
        // arrange
        const expected =  [
            new ScriptStub('S3').withIsRecommended(true),
            new ScriptStub('S4').withIsRecommended(true),
        ];
        const actions = [
            new CategoryStub(3).withScripts(expected[0], new ScriptStub('S1').withIsRecommended(false)),
            new CategoryStub(2).withScripts(expected[1], new ScriptStub('S2').withIsRecommended(false)),
        ];
        const sut = new ApplicationBuilder().withActions(actions).construct();
        // act
        const actual = sut.getRecommendedScripts();
        // assert
        expect(expected[0]).to.deep.equal(actual[0]);
        expect(expected[1]).to.deep.equal(actual[1]);
    });
    describe('actions', () => {
        it('cannot construct without actions', () => {
            // arrange
            const categories = [];
            // act
            function construct() {
                new ApplicationBuilder().withActions(categories).construct();
             }
            // assert
            expect(construct).to.throw('Application must consist of at least one category');
        });
        it('cannot construct without scripts', () => {
            // arrange
            const categories = [
                new CategoryStub(3),
                new CategoryStub(2),
            ];
            // act
            function construct() {
                new ApplicationBuilder().withActions(categories).construct();
            }
            // assert
            expect(construct).to.throw('Application must consist of at least one script');
        });
        it('cannot construct without any recommended scripts', () => {
            // arrange
            const categories = [
                new CategoryStub(3).withScripts(new ScriptStub('S1').withIsRecommended(false)),
                new CategoryStub(2).withScripts(new ScriptStub('S2').withIsRecommended(false)),
            ];
            // act
            function construct() {
                new ApplicationBuilder().withActions(categories).construct();
            }
            // assert
            expect(construct).to.throw('Application must consist of at least one recommended script');
        });
    });
    it('totalScripts counts right', () => {
        // arrange
        const categories = [
            new CategoryStub(1).withScripts(new ScriptStub('S1').withIsRecommended(true)),
            new CategoryStub(2).withScripts(new ScriptStub('S2'), new ScriptStub('S3')),
            new CategoryStub(3).withCategories(new CategoryStub(4).withScripts(new ScriptStub('S4'))),
        ];
        // act
        const sut = new ApplicationBuilder().withActions(categories).construct();
        // assert
        expect(sut.totalScripts).to.equal(4);
    });
    it('totalCategories counts right', () => {
        // arrange
        const categories = [
            new CategoryStub(1).withScripts(new ScriptStub('S1').withIsRecommended(true)),
            new CategoryStub(2).withScripts(new ScriptStub('S2'), new ScriptStub('S3')),
            new CategoryStub(3).withCategories(new CategoryStub(4).withScripts(new ScriptStub('S4'))),
        ];
        // act
        const sut = new ApplicationBuilder().withActions(categories).construct();
        // assert
        expect(sut.totalCategories).to.equal(4);
    });
    describe('information', () => {
        it('sets information as expected', () => {
            // arrange
            const expected = new ProjectInformation(
                'expected-name', 'expected-repo', '0.31.0', 'expected-homepage');
            // act
            const sut = new ApplicationBuilder().withInfo(expected).construct();
            // assert
            expect(sut.info).to.deep.equal(expected);
        });
        it('cannot construct without information', () => {
            // arrange
            const information = undefined;
            // act
            function construct() {
                return new ApplicationBuilder().withInfo(information).construct();
            }
            // assert
            expect(construct).to.throw('undefined info');
        });
    });
    describe('os', () => {
        it('sets os as expected', () => {
            // arrange
            const expected = OperatingSystem.macOS;
            // act
            const sut = new ApplicationBuilder().withOs(expected).construct();
            // assert
            expect(sut.os).to.deep.equal(expected);
        });
        it('cannot construct with unknown os', () => {
            // arrange
            const os = OperatingSystem.Unknown;
            // act
            function construct() {
                return new ApplicationBuilder().withOs(os).construct();
            }
            // assert
            expect(construct).to.throw('unknown os');
        });
    });
    describe('scriptingDefinition', () => {
        it('sets scriptingDefinition as expected', () => {
            // arrange
            const expected = getValidScriptingDefinition();
            // act
            const sut = new ApplicationBuilder().withScripting(expected).construct();
            // assert
            expect(sut.scripting).to.deep.equal(expected);
        });
        it('cannot construct without initial script', () => {
            // arrange
            const scriptingDefinition = undefined;
            // act
            function construct() {
                return new ApplicationBuilder().withScripting(scriptingDefinition).construct();
            }
            // assert
            expect(construct).to.throw('undefined scripting definition');
        });
    });
});

function getValidScriptingDefinition(): IScriptingDefinition {
    return {
        fileExtension: '.bat',
        language: ScriptingLanguage.batchfile,
        startCode: 'start',
        endCode: 'end',
    };
}

class ApplicationBuilder {
    private os = OperatingSystem.Windows;
    private info = new ProjectInformation('name', 'repo', '0.1.0', 'homepage');
    private actions: readonly ICategory[] = [
        new CategoryStub(1).withScripts(new ScriptStub('S1').withIsRecommended(true)),
    ];
    private script: IScriptingDefinition = getValidScriptingDefinition();
    public withOs(os: OperatingSystem): ApplicationBuilder {
        this.os = os;
        return this;
    }
    public withInfo(info: IProjectInformation) {
        this.info = info;
        return this;
    }
    public withActions(actions: readonly ICategory[]) {
        this.actions = actions;
        return this;
    }
    public withScripting(script: IScriptingDefinition) {
        this.script = script;
        return this;
    }
    public construct(): Application {
        return new Application(this.os, this.info, this.actions, this.script);
    }
}
