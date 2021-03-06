/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as i18n from '@angular/compiler/src/i18n/i18n_ast';
import {Serializer} from '@angular/compiler/src/i18n/serializers/serializer';
import {beforeEach, ddescribe, describe, expect, iit, inject, it, xdescribe, xit} from '@angular/core/testing/testing_internal';

import {HtmlParser} from '../../src/html_parser/html_parser';
import {DEFAULT_INTERPOLATION_CONFIG} from '../../src/html_parser/interpolation_config';
import {MessageBundle, serializeAst, strHash} from '../../src/i18n/message_bundle';

export function main(): void {
  describe('MessageBundle', () => {
    describe('Messages', () => {
      let messages: MessageBundle;

      beforeEach(() => { messages = new MessageBundle(new HtmlParser, [], {}); });

      it('should extract the message to the catalog', () => {
        messages.updateFromTemplate(
            '<p i18n="m|d">Translate Me</p>', 'url', DEFAULT_INTERPOLATION_CONFIG);
        expect(humanizeMessages(messages)).toEqual([
          'a486901=Translate Me',
        ]);
      });

      it('should extract the same message with different meaning in different entries', () => {
        messages.updateFromTemplate(
            '<p i18n="m|d">Translate Me</p><p i18n>Translate Me</p>', 'url',
            DEFAULT_INTERPOLATION_CONFIG);
        expect(humanizeMessages(messages)).toEqual([
          'a486901=Translate Me',
          '8475f2cc=Translate Me',
        ]);
      });
    });

    describe('strHash', () => {
      it('should return a hash value', () => {
        // https://github.com/google/closure-library/blob/1fb19a857b96b74e6523f3e9d33080baf25be046/closure/goog/string/string_test.js#L1115
        expectHash('', 0);
        expectHash('foo', 101574);
        expectHash('\uAAAAfoo', 1301670364);
        expectHash('a', 92567585, 5);
        expectHash('a', 2869595232, 6);
        expectHash('a', 3058106369, 7);
        expectHash('a', 312017024, 8);
        expectHash('a', 2929737728, 1024);
      });
    });
  });
}

class _TestSerializer implements Serializer {
  write(messageMap: {[id: string]: i18n.Message}): string {
    return Object.keys(messageMap)
        .map(id => `${id}=${serializeAst(messageMap[id].nodes)}`)
        .join('//');
  }

  load(content: string, url: string, placeholders: {}): {} { return null; }
}

function humanizeMessages(catalog: MessageBundle): string[] {
  return catalog.write(new _TestSerializer()).split('//');
}

function expectHash(text: string, decimal: number, repeat: number = 1) {
  let acc = text;
  for (let i = 1; i < repeat; i++) {
    acc += text;
  }

  const hash = strHash(acc);
  expect(typeof(hash)).toEqual('string');
  expect(hash.length > 0).toBe(true);
  expect(parseInt(hash, 16)).toEqual(decimal);
}