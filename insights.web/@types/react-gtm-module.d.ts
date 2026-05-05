declare module "react-gtm-module" {
  export interface TagManagerArgs {
    gtmId: string;
    dataLayer?: Record<string, any>;
  }

  export default class TagManager {
    static initialize(args: TagManagerArgs): void;
    static dataLayer(args: { dataLayer: Record<string, any> }): void;
  }
}
