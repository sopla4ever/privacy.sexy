import { BaseEntity } from '@/infrastructure/Entity/BaseEntity';
import { IScript } from '@/domain/IScript';
import { RecommendationLevel } from '@/domain/RecommendationLevel';

export class ScriptStub extends BaseEntity<string> implements IScript {
    public name = `name${this.id}`;
    public code = `REM code${this.id}`;
    public revertCode = `REM revertCode${this.id}`;
    public readonly documentationUrls = new Array<string>();
    public level = RecommendationLevel.Standard;

    constructor(public readonly id: string) {
        super(id);
    }

    public canRevert(): boolean {
        return Boolean(this.revertCode);
    }

    public withLevel(value: RecommendationLevel): ScriptStub {
        this.level = value;
        return this;
    }

    public withCode(value: string): ScriptStub {
        this.code = value;
        return this;
    }

    public withName(name: string): ScriptStub {
        this.name = name;
        return this;
    }

    public withRevertCode(revertCode: string): ScriptStub {
        this.revertCode = revertCode;
        return this;
    }
}
