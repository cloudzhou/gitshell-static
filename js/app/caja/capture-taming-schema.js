// Copyright (C) 2012 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview
 * Given that the next script executed is the cajoled TamingSchema module,
 * make the TamingSchema entry points available in the global scope.
 *
 * @author ihab.awad@gmail.com
 * @requires CaptureCajoledModule
 * @overrides window
 * @provides TamingSchema
 */

var TamingSchema = undefined;

CaptureCajoledModule(function(imports) {
  TamingSchema = imports.TamingSchema;
});

// Exports for closure compiler.
if (typeof window !== 'undefined') {
  window['CaptureCajoledModule'] = CaptureCajoledModule;
}
