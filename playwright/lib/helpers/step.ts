import { test } from '@playwright/test';

/**
 * Method decorator that wraps a Page Object / service method in a
 * `test.step`, so each action shows up as a named, collapsible step in the
 * Playwright trace and HTML report — making failures easy to locate.
 *
 * @param message Optional step label. Defaults to `ClassName.methodName`.
 *
 * @example
 * class LoginPage {
 *   \@step()
 *   async login() { ... }   // appears as "LoginPage.login" in the trace
 * }
 */
export function step<This, Args extends any[], Return>(message?: string) {
  return function actualDecorator(
    target: (this: This, ...args: Args) => Promise<Return>,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return>>
  ) {
    function replacementMethod(this: any, ...args: Args) {
      const name = message ?? `${this.constructor.name}.${context.name as string}`;
      return test.step(name, async () => target.call(this, ...args), { box: true });
    }
    return replacementMethod;
  };
}
