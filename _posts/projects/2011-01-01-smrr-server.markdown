---
layout: post
categories: resume projects
tags: C# Algorithmics Sockets GIT TDD
datetype: year
title: smrr-server
---

Simple Massive Realtime Ranking Server

Creé este proyecto para our.com.

Es un servidor de rankings muy sencillo: usuarios asociados a una puntuación y a un instante en el que se consigue dicha puntuación.

Permite insertar puntuaciones en tiempo logarítmico, listar puntuaciones en tiempo lineal y obtener la posición de un usuario en tiempo logarítmico.

El problema era que la única forma que teníamos de trabajar con millones de puntuaciones y tener operaciones con tiempos razonables era precalcular diariamente todos los datos. Con lo que no escalaba bien y no era en tiempo real.

Diseñé un algoritmo basado en árboles RedBlack que añadía stats a los nodos de forma que mantenía la inserción logarítmica y permitía localizar en un tiempo logarítmico un nodo por posición.

