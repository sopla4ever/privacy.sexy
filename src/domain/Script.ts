import { BaseEntity } from '@/infrastructure/Entity/BaseEntity';
import { IScript } from './IScript';
import { IScriptCode } from './IScriptCode';

export class Script extends BaseEntity<string> implements IScript {
    constructor(
        public readonly name: string,
        public readonly code: IScriptCode,
        public readonly documentationUrls: ReadonlyArray<string>,
        public readonly isRecommended: boolean) {
        super(name);
        if (!code) {
            throw new Error('undefined code');
        }
    }
    public canRevert(): boolean {
        return Boolean(this.code.revert);
    }
}
