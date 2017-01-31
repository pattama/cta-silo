CTA-SILO
========

This brick provides a backup & restore utility for documents that transit in a flowcontrol application 

First refer to cta-brick and cta-flowcontrol repositories to familiarize yourself with those concepts.

Like all bricks, it can be easily injected into a flowcontrol application using a configuration

# Brick dependencies

none

# Brick properties

filename: path to a file for storage

# Brick contracts

| nature.type | nature.quality | payload sample
| --- | --- | --- | ---
| documents | backup | {doc: {foo: 'bar'}} or {doc: [{foo: 'bar'}, {bar: 'foo'}]} 
| documents | restore | {query: {}, clear: true}
| documents | clear | {query: {}}

All payloads accept a callback function