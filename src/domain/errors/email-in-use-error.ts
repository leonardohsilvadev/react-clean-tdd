export class EmailInUseError extends Error {
  constructor () {
    super('Esse e-mail já está sendo usado')
    this.name = 'EmailInUseError'
  }
}