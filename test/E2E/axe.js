/*
  Copyright (c) 2023 Contributors to the  Eclipse Foundation.
  This program and the accompanying materials are made
  available under the terms of the Eclipse Public License 2.0
  which is available at https://www.eclipse.org/legal/epl-2.0/
  SPDX-License-Identifier: EPL-2.0

  Contributors:

*/

let AxeHtmlReporter = require('axe-html-reporter');
let fs = require('fs');

describe("Axe Test on Main page", function () {
    before(function(browser){
        browser.windowRect({width: 1246, height: 980})
            .navigateTo("http://localhost:5173/")
            .click("#app > div > header > div.va-navbar__right > div:nth-child(1) > button > span")
            .click("body > div.va-modal.server-url-modal > div.va-modal__container > div > div > div > div.va-card__content > div > div > div")
            .setValue("body > div.va-modal.server-url-modal > div.va-modal__container > div > div > div > div.va-card__content > div > div > div > div > input", "https://ssemenkoff.dev/emondrian/xmla")
            .click("body > div.va-modal.server-url-modal > div.va-modal__container > div > div > div > div.va-card__actions > button > span")
            .click("body > div.va-modal.server-url-modal > div.va-modal__container > div > div > div > div.va-card__content > div.va-message-list-wrapper.mt-2 > ul > li:nth-child(2) > label > span.va-radio__text")
            .click("body > div.va-modal.server-url-modal > div.va-modal__container > div > div > div > div.va-card__actions > button > span")
            .click("#app > div > div.split-container > section > div:nth-child(1) > div > div > section > div:nth-child(1) > div > div > div > div.va-tree-view.tree-view > div:nth-child(7) > div.va-tree-node-root > div > div.va-tree-node-content__item.va-tree-node-content__item--leaf > i")
            .click("#app > div > div.split-container > section > div:nth-child(1) > div > div > section > div:nth-child(1) > div > div > div > div.va-tree-view.tree-view > div:nth-child(6) > div.va-tree-node-root > div > div.va-tree-node-content__item.va-tree-node-content__item--leaf > i")
            .axeInject()
    })



        it("Axe Run", function (browser) {
            browser.axeRun('body',{},(results)=>{
                let html = AxeHtmlReporter.createHtmlReport({ results: results });
                if (!fs.existsSync('tests_output/axe_report.html')) {
                    fs.mkdirSync('tests_output', {
                        recursive: true,
                    });
                }
                fs.writeFileSync('tests_output/axe_report.html', html);

            })
            //throw new Error('timeOut must throw')
        });


    after(function(browser) {
        browser.end();

    })


});
