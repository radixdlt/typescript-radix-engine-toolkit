// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

import { describe, expect, test } from "vitest";
import { utils } from "../src";

describe.each([
  {
    object: {
      helloWorld: 1,
    },
    expectedResult: {
      toSnakeCase: {
        hello_world: 1,
      },
      toCamelCase: {
        helloWorld: 1,
      },
      trim: {
        helloWorld: 1,
      },
    },
  },
  {
    object: {
      hello_world: 1,
    },
    expectedResult: {
      toSnakeCase: {
        hello_world: 1,
      },
      toCamelCase: {
        helloWorld: 1,
      },
      trim: {
        hello_world: 1,
      },
    },
  },
  {
    object: {
      helloWorld: "_badString_Of_Multi_Case_",
    },
    expectedResult: {
      toSnakeCase: {
        hello_world: "_badString_Of_Multi_Case_",
      },
      toCamelCase: {
        helloWorld: "_badString_Of_Multi_Case_",
      },
      trim: {
        helloWorld: "_badString_Of_Multi_Case_",
      },
    },
  },
  {
    object: {
      hello_world: "_badString_Of_Multi_Case_",
    },
    expectedResult: {
      toSnakeCase: {
        hello_world: "_badString_Of_Multi_Case_",
      },
      toCamelCase: {
        helloWorld: "_badString_Of_Multi_Case_",
      },
      trim: {
        hello_world: "_badString_Of_Multi_Case_",
      },
    },
  },

  {
    object: {
      _helloWorld: "_badString_Of_Multi_Case_",
    },
    expectedResult: {
      toSnakeCase: {
        hello_world: "_badString_Of_Multi_Case_",
      },
      toCamelCase: {
        helloWorld: "_badString_Of_Multi_Case_",
      },
      trim: {
        helloWorld: "_badString_Of_Multi_Case_",
      },
    },
  },
  {
    object: {
      _hello_world: "_badString_Of_Multi_Case_",
    },
    expectedResult: {
      toSnakeCase: {
        hello_world: "_badString_Of_Multi_Case_",
      },
      toCamelCase: {
        helloWorld: "_badString_Of_Multi_Case_",
      },
      trim: {
        hello_world: "_badString_Of_Multi_Case_",
      },
    },
  },
  {
    object: {
      item: [
        1,
        2,
        3,
        [
          {
            helloWorld: 1,
          },
        ],
      ],
    },
    expectedResult: {
      toSnakeCase: {
        item: [
          1,
          2,
          3,
          [
            {
              hello_world: 1,
            },
          ],
        ],
      },
      toCamelCase: {
        item: [
          1,
          2,
          3,
          [
            {
              helloWorld: 1,
            },
          ],
        ],
      },
      trim: {
        item: [
          1,
          2,
          3,
          [
            {
              helloWorld: 1,
            },
          ],
        ],
      },
    },
  },
])(
  "Walk object behaves as expected for $object",
  ({ object, expectedResult: { toSnakeCase, toCamelCase, trim } }) => {
    test(`toSnakeCase for ${object} behaves as expected`, () => {
      // Act
      let result = utils.traverseObjectForKeys(object, [utils.toSnakeCase]);

      // Assert
      expect(result).toEqual(toSnakeCase);
    });

    test(`toCamelCase for ${object} behaves as expected`, () => {
      // Act
      let result = utils.traverseObjectForKeys(object, [utils.toCamelCase]);

      // Assert
      expect(result).toEqual(toCamelCase);
    });

    test(`trim for ${object} behaves as expected`, () => {
      // Act
      let result = utils.traverseObjectForKeys(object, [utils.trim("_")]);

      // Assert
      expect(result).toEqual(trim);
    });
  }
);
