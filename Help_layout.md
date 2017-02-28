# Ternary Filter

| Name             | Status  | Stable | Work but need more test | Nightly | Updated by        |
|------------------|---------|--------|-------------------------|---------|-------------------|
| Ternary Filter   | Version | x      | 1.0                     | 1.x     | Mathias PFAUWADEL |

## Patch Notes

1.0 : 1st version working

## Description:
Allow you to create and remove ternary.

## Warning

Ternary should be use, with the filter layout (https://github.com/nevakee716/TernaryFilter/wiki)
and evolveOnDemand (link : TBD)

## Installation
https://github.com/casewise/cpm/wiki
link to EVOD installation (TBD)

## Structure of ternary

Ternary is a symetric association between 3 objects, evolve doesn't have it natively, we made a workaround.

Exemple : We want to make a ternary between A1, O1 and P1. We need to have association between all the elements and on each association we need to fill the uuid of the opposit object (we use uuid instead of id to avoid federation problem)
So we endup with : 

A1O1 with properties containaing (P1 UUID)
A1P1 with properties containaing (O1 UUID)
P1O1 with properties containaing (A1 UUID)

## Screenshot:
![](https://raw.githubusercontent.com/nevakee716/TernaryCreation/master/screen/1.png)

## Options

### EVOD-url : 

Set the URL of EvolveOnDemand

## Configuration

You can use this layout on Index and Object Page, and you will need to use TernaryFilter (https://github.com/nevakee716/TernaryFilter/wiki)

### On ObjectPage

You need to use a the ternaryFilter layout on top, to filter ternary
Display your nodes for exemple Organisation -> Activity -> Process. Don't forget to add UUID on Process and OPPOSITUUIDLIST on the association (the scriptname is static for now, but will be an option later in the development)

<img src="https://raw.githubusercontent.com/nevakee716/TernaryCreation/master/screen/2.png" alt="Drawing" style="width: 95%;"/>

### On IndexPage

You need to concat the ternaryFilter and the TernaryCreation layout like the following configuration

<img src="https://raw.githubusercontent.com/nevakee716/TernaryCreation/master/screen/3.png" alt="Drawing" style="width: 95%;"/>

## Custom Display String

The custom display can be used on the table Cell, but it will be the same on all Object. So if you use different scriptName properties, they need to exist in every ObjectType









