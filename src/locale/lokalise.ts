import axios, {AxiosInstance} from 'axios';
import DeviceInfo from 'react-native-device-info';
import ENV from '@/constants/env';

interface LokaliseBundleResponse {
  data: {
    url: string;
    version: number;
  };
}

interface Translations {
  [lang: string]: {
    [namespace: string]: {
      [key: string]: string;
    };
  };
}

interface Language {
  iso: string;
  items: {
    key: string;
    value: string;
  }[];
}

export class Lokalise {
  private readonly FRAMEWORK = 'android_sdk';

  public bundleVersion: number = 0;
  public bundleUrl: string = '';
  private api: AxiosInstance;

  constructor(
    private baseURL: string,
    private sdkToken: string,
    private projectId: string,
    private usePreRelease: boolean,
  ) {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // Set the request timeout
    });
  }

  async checkForUpdates() {
    const response = await this.api.get(
      `/v3/lokalise/projects/${this.projectId}/frameworks/${this.FRAMEWORK}`,
      {
        params: {
          appVersion: DeviceInfo.getVersion().split('-')[0],
          transVersion: this.bundleVersion,
          prerelease: this.usePreRelease,
        },
        headers: {
          'x-ota-api-token': this.sdkToken,
        },
      },
    );

    if (response.status === 204) {
      return {
        updateAvailable: false,
        version: this.bundleVersion,
        url: this.bundleUrl,
      };
    }

    const bundleInfo = response.data as LokaliseBundleResponse;
    this.bundleVersion = bundleInfo.data.version;
    this.bundleUrl = bundleInfo.data.url;

    return {
      updateAvailable: true,
      version: this.bundleVersion,
      url: bundleInfo.data.url,
    };
  }

  async loadTranslationsFromUrl(url: string) {
    const translations: Translations = {};
    const response = await this.api.get(url);

    response.data.forEach((lang: Language) => {
      translations[lang.iso] = {
        translation: {},
      };
      lang.items.forEach(item => {
        translations[lang.iso].translation[item.key] = item.value;
      });
    });

    return translations;
  }
}

export const lokalise = new Lokalise(
  ENV.LOKALISE_OTA_URL!,
  ENV.LOKALISE_SDK_TOKEN!,
  ENV.LOKALISE_PROJECT_ID!,
  ENV.IS_A_DEV_DISTRIBUTION,
);
