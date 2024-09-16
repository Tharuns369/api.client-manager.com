import * as v from 'valibot';

export const clientSchema = v.object({
    name: v.pipe(v.string(), v.email()),
    phone: v.pipe(v.string(), v.minLength(8)),
});
