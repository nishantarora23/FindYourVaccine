import * as Handlebars from 'handlebars'

export class Substituter {
    static replace(value: string, replacer: object): string {
        const template = Handlebars.compile(value);
        return template(replacer);
    }
}