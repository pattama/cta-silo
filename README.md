# cta-silo
[![Build Status](https://travis-ci.org/thomsonreuters/cta-silo.svg?branch=master)](https://travis-ci.org/thomsonreuters/cta-silo)
[![Coverage Status](https://coveralls.io/repos/github/thomsonreuters/cta-silo/badge.svg?branch=master)](https://coveralls.io/github/thomsonreuters/cta-silo?branch=master)
[![codecov](https://codecov.io/gh/thomsonreuters/cta-silo/branch/master/graph/badge.svg)](https://codecov.io/gh/thomsonreuters/cta-silo)

Silo Modules for Compass Test Automation, One of Libraries in CTA-OSS Framework

## General Overview

### Overview

The **cta-silo** provides a **local storage** to store data (documents). Currently, the **cta-silo** uses [**NeDB**](https://github.com/louischatriot/nedb), the _file-based_ **JavaScript Database**.

## Guidelines

We aim to give you brief guidelines here.

1. [Usage](#1-usage)
1. [Configuration](#2-configuration)
1. [Contracts](#3-contracts)

### 1. Usage

**cta-silo** extends **Brick** (_cta-brick_). In order to use it, we need to provide a **configuration**. The **cta-silo** has **no dependencies**.

```javascript
const config = {
  name: 'silo-01',
  module: 'cta-silo',
  properties: {
    filename: `${__dirname}${path.sep}silo.db`,
  },
};
```

The data will _be stored_ in **silo.db** file.

[back to top](#guidelines)

### 2. Configuration

The **configuration** requires **properties.filename**.

```javascript
const config = {
  ...
  properties: {
    filename: `absolute/path/to/a/storage/file`,
  },
};
```

The **properties.filename** must be a filename with **absolute path**. The **properties** provide a configuration to **NeDB**.

[back to top](#guidelines)

### 3. Contracts

| nature.type | nature.quality | payload
| --- | --- | --- | ---
| documents | backup | { doc: { id: '01' } } or { doc: [ { id: '01' }, { id: '02' } ] } 
| documents | restore | { query: {}, clear: true }
| documents | clear | { query: {} }

[back to top](#guidelines)

------

## To Do

## Considerations

#### Alternatives to NeDB are [leveldb](http://leveldb.org/) and [EJDB](http://ejdb.org/)

------
