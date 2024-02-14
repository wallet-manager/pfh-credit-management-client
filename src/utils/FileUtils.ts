import { default as fs } from 'node:fs'

export function appendFile(file:string, content:string) {
    fs.appendFileSync(file, content);
}

export function writeFile(file:string, content:string) {
    fs.writeFileSync(file, content);
}