import { ManifestService } from './services/manifest.service';

/** API client for Saucedemo's static resources (e.g. the PWA manifest). */
export class SaucedemoClient {
  public manifest: ManifestService;

  constructor() {
    this.manifest = new ManifestService();
  }
}
