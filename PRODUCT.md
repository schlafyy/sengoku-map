# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

HTML/CSS/JS shown in its own native window, packaged as a Windows exe (chosen by the user). The same files should later be able to run on the user's iPhone, as the Slow Line reading app does.

## Users

The owner, on their Windows PC. They're interested in Japanese history (Japan is one of the lines in their Slow Line reading app) and want to understand the Sengoku period by watching it happen, not by reading a list.

## Product Purpose

An interactive map of Japan's Sengoku period (1467–1603). Drag a timeline and watch clan territory shift province by province, battles light up, and alliances form and break. Success: the period's shape (who rose, who fell, and why) becomes clear from the map alone, and anything on it can be opened for the story behind it.

## Positioning

A personal, explorable atlas of the period: the map is the interface, and the history is layered under it. Glance at the map, click for a short story, keep going for the full account.

## Capabilities and Constraints

- Depth: the user asked for "explore + short stories" combined with "deep study". Every clan, battle and province opens to a short paragraph first, with a longer write-up, key people and alliances one step further.
- Alliances are shown as links between clans.
- Province level: the 68 old provinces (令制国). Mutsu and Dewa are undivided, as they were before 1869. Each province shows its dominant power at a point in time. Provinces that were split or held by many small lords must read as split or contested, never as falsely solid.
- Names: romanized English leads, with kanji beside it, for example "Oda 織田", "Battle of Okehazama 桶狭間の戦い", "Owari 尾張".
- Historical accuracy matters more than coverage. Territory data is an approximation at province level, and the app must say so.
- Offline: everything is bundled; no network is needed.

## Evidence on Hand

- Province shapes: "Provinces of Japan with names.svg" by Ash_Crow, Wikimedia Commons, CC BY 2.5 (attribution required). It was matched to province names on 2026-11-07.
- No other datasets exist yet: territory, battles, clans, people and alliances are written for this project from historical knowledge and must not be presented as sourced from a dataset.

## Product Principles

1. The map is the interface: everything starts from a place and a moment in time.
2. Glance, then go deeper: a short answer first, the full account on request, never a wall of text up front.
3. Honest about uncertainty: split, contested and approximate stay visible as such.
4. Time is the main control: moving through the years is the most direct, best-feeling interaction.
