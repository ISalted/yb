import { ManifestService } from './services/manifest.service';

export class SaucedemoClient {
  public manifest: ManifestService;

  constructor() {
    this.manifest = new ManifestService();
  }
}
