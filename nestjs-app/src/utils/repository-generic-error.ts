export class RepositoryGenericError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RepositoryGenericError';
  }
}
