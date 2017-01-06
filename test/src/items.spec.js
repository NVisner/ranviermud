'use strict';

const expect = require('chai').expect;

const Items = require('../../src/items').Items;
const Item = require('../../src/items').Item;

const testItemConfig = {
  short_description: 'potato',
  keywords:          ['potato', 'spud'],
  description:       'a potato',
  inventory:         [],
  room:              2,
  vnum:              4
};
const createTestItems = config => Array(5).fill({}).map(_ => new Item(config));


describe('Item manager', () => {
  const items = new Items();
  const testItems = createTestItems(testItemConfig);

  it('should be able to get directory strings', () =>{
    expect(typeof items.getScriptsDir() === 'string').to.be.true;
    expect(typeof items.getL10nDir() === 'string').to.be.true;
  });

  it('should be able to add items and set uuid', () => {
    testItems.forEach(item => items.addItem(item));
    let count = 0;
    items.each(item => {
      count++;
      expect(item.getUuid()).to.be.ok;
    });
    expect(count === 5).to.be.true;
  });

  it('should be able to get all instances of an item by vnum', () => {
    const testDorp = Object.assign({}, testItemConfig, { vnum: 3 });
    items.addItem(new Item(testDorp));

    const dorps = items.getByVnum(3);
    const spuds = items.getByVnum(4);

    expect(dorps.length === 1).to.be.true;
    expect(spuds.length === 5).to.be.true;
  });

  it('should be able to get an item by its uid', () => {
    const uid    = Object.keys(items.objects)[0];
    const actual = items.objects[uid];
    const item   = items.get(uid);
    expect(actual === item).to.be.true;
  });

});

describe('Item class', () => {
  const testItem = new Item(testItemConfig);

  it('should be able to set and get attributes', () => {
    testItem.setAttribute('deliciousness', 7);
    expect(testItem.getAttribute('deliciousness') === 7).to.be.true;
  });

  it('should have a desc', () => {
    const desc = testItem.getDescription();
    expect(desc === testItemConfig.description).to.be.true;
  });

  it('should be able to check keywords', () => {
    const test = 'spud';
    expect(testItem.hasKeyword(test)).to.be.true;
  });

  it('should be able to flatten itself into json obj', () => {
    const flatObj = testItem.flatten();
    expect(flatObj).to.deep.equal({
        "attributes": {
          "deliciousness": 7
        },
        "description": "a potato",
        "room_description": "",
        "equipped": false,
        "container": null,
        "inventory": [],
        "behaviors": null,
        "holder": "",
        "keywords": [
          "potato",
          "spud"
        ],
        "prerequisites": {},
        "script": null,
        "short_description": "potato",
        "uuid": null,
        "vnum": 4
      });
  });

});