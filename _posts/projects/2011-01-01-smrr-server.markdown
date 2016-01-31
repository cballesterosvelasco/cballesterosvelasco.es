---
layout: post
categories: resume projects
tags: C# Algorithmics Sockets GIT TDD
datetype: year
title: smrr-server
---

Simple Massive Realtime Ranking Server

It is a very simple ranking server: users have a score associated and an instant associated to that user/score pair.

It allows to insert scores in logarithmic time, to list scores in linear time and to get the position of an user in logarithmic time.

The problem was that the only way we have to handle millions of scores and have reasonable times was to precalculate in a daily basis all the data. So it was not scaling well and was not realtime.

I dessigned an algorithm based in RebBlack trees that added stats to all nodes in a way that keeped logarithmic insertion and allowed to locate also in logarithmic time a node by position.
