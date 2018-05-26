import { Element } from './Element';

// Let's attempt to reimplement a GDI-friendly React-like component

// tslint:disable-next-line:no-empty-interface
interface Component<P = {}, S = {}> {}
class Component<P, S> {
  public props: P;

  constructor(props: P) {
    this.props = props;
  }

  public render(): Element | null {
    return null;
  }
}
