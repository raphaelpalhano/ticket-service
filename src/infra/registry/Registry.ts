export default class Registry {
  dependencies: any = {};

  constructor() {
    return this;
  }

  provide(name: string, value: any) {
    this.dependencies[name] = value;
  }

  inject(name: string) {
    return this.dependencies[name];
  }
}
