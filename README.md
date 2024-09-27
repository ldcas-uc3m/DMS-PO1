# Práctica Obligatoria, Parte 1: Integración de datos y funcional
By Luis Daniel Casais Mezquida, Lucas Gallego Bravo, Till Niklas Kobele, Francisco Montañés de Lucas & Diego Picazo García  
Datos Masivos y Encadenados 24/25  
Máster en Ingeniería Informática  
Universidad Carlos III de Madrid


## Enunciado de la práctica
El objetivo del caso práctico es trabajar en un escenario de integración de datos e integración funcional en el dominio de las ayudas y subvenciones. Se trata de aprovechar los datos en abierto para proporcionar servicios y aplicaciones que faciliten la localización de diferentes ayudas y subvenciones a las que se puede acceder.

Es posible localizar información relativa a ayudas, becas y subvenciones en diferentes portales de las distintas administraciones públicas. Por ejemplo en [www.ciencia.gob.es](https://www.ciencia.gob.es/) existe una sección de convocatorias donde se puede acceder a información acerca de las mismas. Otros ministerios como el de Industria, Turismo y Comercio ofrecen también información: [www.mincotur.gob.es/PortalAyudas/Paginas/convocatorias-ayudas.aspx](https://www.mincotur.gob.es/PortalAyudas/Paginas/convocatorias-ayudas.aspx).

También es posible que a través de las redes sociales, diferentes ministerios hagan publicaciones en las que se anuncien nuevas convocatorias o que otros usuarios publiquen también información relevante utilizando hashtags relacionados.

A la hora de presentar las solicitudes, también puede ser útil conocer dónde hay una oficina de registro donde poder hacerlo. Para ello se pueden utilizar datos publicados por las ciudades, como es el caso del [Ayuntamiento de Madrid](https://datos.madrid.es/portal/site/egob/) que además proporciona una API para el acceso a la información.

Otras fuentes de datos, a modo de ejemplo, que pueden integrarse son:
- [Datos del consorcio de transportes de Madrid](https://data-crtm.opendata.arcgis.com/)
- Portales web sobre transporte público y privado que contienen información de itinerarios, infraestructuras, etc. ([Metro de Madrid](https://www.metromadrid.es/)).
- Información del Tráfico, muy útil para llegar a tiempo para presentar propuestas de última hora ([DGT](https://nap.dgt.es/dataset))
- Mapas, planos, e información geográfica ([Google Maps](https://www.google.com/maps), [CartoDB](https://github.com/CartoDB/cartodb), [OpenStreetMap](https://www.openstreetmap.org/)...).

Además, Twitter y otras redes sociales similares permitirían monitorizar información acerca de estos y otros aspectos:
1. ¿Qué opinión hay acerca de las ayudas?
2. ¿Están anunciando las administraciones nuevas ayudas o lanzando recordatorios de la fecha de fin de las solicitudes?

En la asignatura de Datos Masivos y Encadenados se estudian tecnologías que facilitan la integración de aplicaciones a distintos niveles: datos, funcional o lógico y presentación. El objetivo de la práctica de este año consiste en desarrollar un esquema de integración de datos, diseñando una arquitectura software y hardware y preparar una prueba de concepto para mostrar como sería el acceso a los datos, y su posterior análisis y visualización. Evidentemente, se trata de aplicar los conocimientos que se irán adquiriendo durante la asignatura, de manera que no será necesario implementar nuevos métodos o algoritmos para el tratamiento de esta información, sino que será necesario, únicamente, integrar sistemas ya existentes.

Así, la solución que se proponga en la práctica deberá integrar información y funcionalidad de distintas fuentes, almacenándola y proporcionando algún mecanismo de visualización. El demostrador consistirá:
- Proporcionar información extraída de al menos **2 fuentes de datos** y de al
menos **un servicio externo**.
- Mostrar el formato de los datos unificados, es decir, una vez extraídos de las distintas fuentes, cuál sería el formato en el que se almacenaría, incluyendo algunos datos de muestra.
- Mostrar al menos **dos visualizaciones de datos** que demuestren la utilidad de los datos integrados.

A continuación, se proporciona exclusivamente a modo de ejemplo un escenario de integración, consistente en un servicio de localización de ayudas. El objetivo sería desarrollar un servicio que ayude a localizar ayudas y subvenciones. Se podría integrar información de (1) las webs de información de los ministerios, (2) mapas de lugares donde presentar la solicitud, (3) mensajes de las redes sociales relacionados con las convocatorias (4) posibles aparcamientos al lugar donde presentar la solicitud (5) estado del tráfico y otros recursos que fueran de utilidad. Como APIs a integrar (1) acceso a la información del ayuntamiento de Madrid y Aemet (2) Localización geográfica, etc.

Se pide:
1. Definir el valor añadido que proporciona al usuario el escenario de integración (conocimiento que no es posible obtener de las fuentes de datos por separado).
2. Seleccionar, recopilar y analizar las fuentes a integrar comprobando el modelo de datos y el formato, el histórico y periodo contemplado, la periodicidad de actualización, etc.
3. Diseñar un sistema software que recoja la información de las fuentes seleccionadas en el punto anterior (en tiempo real o fuentes off-line) basándose en los conceptos de integración vistos en la asignatura.
4. Elegir un sistema de integración de datos (virtual o material) adecuado y de procesamiento de la información obtenida. En el caso de optar por un enfoque material, la tecnología propuesta para el almacenamiento de la información recogida debe ajustarse a un paradigma de arquitectura distribuida. En caso de elegir una arquitectura de tipo virtual, deberá justificarse adecuadamente la ausencia de la capa de almacenamiento.
5. Diseñar un sistema que basándose en los datos integrados realice los análisis requeridos y que además visualice la información utilizando distintos formatos (líneas temporales, mapas, gráficos estadísticos, etc.). El análisis de los datos se realizará a través de un sistema externo (sea una API, una librería software externa, etc.). Este diseño debe basarse en alguno de los paquetes de software estudiados en la asignatura.
6. Plantear las consultas básicas que proporcionen la información requerida por el usuario. Por ejemplo, en el escenario proporcionado a modo de ejemplo, algunas consultan podrían ser (a) cuál es la ruta con menos tráfico para al registro del Ayuntamiento de Madrid en el momento de la consulta y (b) mostrar una línea temporal con la evolución de las ayudas ofrecidas por los distintos ministerios.
7. Para la visualización pueden utilizarse herramientas como librerías de visualización en javascript ([protovis](http://mbostock.github.com/protovis/), [Google API visualization](https://developers.google.com/chart/interactive/docs/reference), [dygraphs](http://dygraphs.com/)), [Gephi](http://gephi.org/) (para visualización de grafos), [Google Data Studio](http://datastudio.google.com/) o software como [Tableau](http://www.tableau.com/) entre otras opciones.
8. Implementar una prueba de concepto del sistema diseñado. Esta prueba no tiene que incluir toda la propuesta teórica, puede ser una parte. Para mostrar la viabilidad de la propuesta, se deberán integrar al menos **dos fuentes de datos** y desde el punto de vista de la integración funcional será necesario integrar al menos **un servicio de terceros**, por ejemplo, para analizar el texto de los comentarios de los ciudadanos en redes sociales. En la entrega se deberá incluir un fichero con datos extraído de cada fuente y servicio, y al menos un fichero que muestre cómo quedarían los datos integrados (la descripción de los datos se incluirá en la memoria). A partir de los datos integrados se propondrán al menos dos visualizaciones de datos. Tanto la integración de datos como la funcional se hará de acuerdo a las tecnologías estudiadas en la asignatura. La funcionalidad de esta prueba de concepto deberá validarse con los profesores de la asignatura en la sesión establecida en el cronograma de la asignatura.




## Instalación y ejecución


