const { defineConfig } = require("cypress");

module.exports = defineConfig({
  "experimentalStudio": true,
  "experimentalWebKitSupport": true,
  reporter:"cypress-multi-reporters",
  reporterOptions: {
    reporterEnabled: "cypress-mochawesome-reporter, mocha-junit-reporter",
    cypressMochawesomeReporterReporterOptions:{
      reportDir: "cypress/reports",
      charts: true,
      reportPageTitle: "Steves Tests",
      embeddedScreenshots: true,
      inLineAssets: true
    },
    mochaJunitReporterReporterOptions:{
      mochaFile: "cypress/reports/junit/junit-results-[hash].xml"
    }
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib')
      const exec = require('child_process').execSync

      on('before:run', async (details)=>{
        console.log('override before:run')
        await beforeRunHook(details)
        await exec("IF EXIST cypress\\screenshots rmdir /Q /S cypress\\screenshots") //Windows only shellscript
        await exec("IF EXIST cypress\\reports rmdir /Q /S cypress\\reports") //Windows only shell script
      })
      on('after:run', async ()=>{
        console.log('override after:run')
        await exec("npx jrm ./cypress/reports/junit/mergedjunitreport.xml ./cypress/reports/junit/*.xml")
        await afterRunHook()
      })
    },
  },
});
