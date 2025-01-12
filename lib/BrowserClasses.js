const puppeteer = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth");
const { executablePath } = require("puppeteer");
let newInjectedPage;
let isFingerprintInjectorEnabled = false;

puppeteer.use(stealthPlugin())

/**
 * Main class untuk Setup Browser
 * @class ScraperBank
 * @param {any} user ( user ibank )
 * @param {any} pass ( user ibank )
 * @param {any} useFingerPrint=false ( default )
 * @returns {any}
 * @memberof ScraperBank
 */
class ScraperBank {
  constructor(user, pass, args, useFingerPrint = false) {
    this.user = user || "username";
    this.pass = pass || "pass";
    
    this.proxyUrl = process.env.PROXY_URL; 
    this.anonymizedProxyUrl = null; 

    this.konfigbrowser = {
      headless: true,
      args: [
        "--window-position=000,000",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-web-security",
        "--disable-features=IsolateOrigins",
        "--disable-site-isolation-trials",
      ],
      executablePath: executablePath("chrome")
    };

    if (useFingerPrint) {
      newInjectedPage = require("fingerprint-injector");
      isFingerprintInjectorEnabled = true;
    }
  }

  async launchBrowser() {
    try {
      if (this.proxyUrl) {
        this.anonymizedProxyUrl = await proxyChain.anonymizeProxy(this.proxyUrl);
        this.konfigbrowser.args.push(`--proxy-server=${this.anonymizedProxyUrl}`);
      }

      this.browser = await puppeteer.launch(this.konfigbrowser);

      if (isFingerprintInjectorEnabled) {
        this.page = await newInjectedPage(
          this.browser,
          {

              fingerprintOptions: {
                  devices: ['desktop'],
                  operatingSystems: ['macos'],
              },
          },
        );
      } else {
        this.page = await this.browser.newPage();
      }

      return this.page;
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = ScraperBank;
