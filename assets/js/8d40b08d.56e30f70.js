(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{84:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return r})),n.d(t,"metadata",(function(){return s})),n.d(t,"toc",(function(){return d})),n.d(t,"default",(function(){return u}));var a=n(3),o=n(7),i=(n(0),n(99)),r={slug:"Introduction",title:"Introduction",author:"Charles Allen",author_title:"CourtHive Creator",author_url:"https://github.com/CourtHive",tags:["open source","tournament management"]},s={permalink:"/TMX/blog/Introduction",source:"@site/blog/2021-04-08.md",description:"CourtHive/TMX 2.0 is an open source tournament management application which makes use of the ITF's Tennis Open Data Standards, hereafter referred to as TODS.",date:"2021-04-08T00:00:00.000Z",formattedDate:"April 8, 2021",tags:[{label:"open source",permalink:"/TMX/blog/tags/open-source"},{label:"tournament management",permalink:"/TMX/blog/tags/tournament-management"}],title:"Introduction",readingTime:1.635,truncated:!1},d=[],l={toc:d};function u(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(i.b)("wrapper",Object(a.a)({},l,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,"CourtHive/TMX 2.0 is an open source tournament management application which makes use of the ITF's ",Object(i.b)("a",{parentName:"p",href:"https://itftennis.atlassian.net/wiki/spaces/TODS/overview'"},"Tennis Open Data Standards"),", hereafter referred to as TODS."),Object(i.b)("p",null,'TMX 1.0 originated as a data visualization project which harvested tournament results out of PDFs and later XLS files that were based on a very old ITF spreadsheet format. Once the ability to reliably drag/drop files into the "viewer" had been completed, the next phase focused on automatically generating ranking points and then generating entire tournament files and enabling score entry and online publishing.'),Object(i.b)("p",null,"The first phase of the TMX project was my playground. I began interacting with and being mentored by tournament directors and experimented with IndexedDB/Dexie, Socket.io, Node.js, Redis, Mongo, and a number of front end libraries. The code was very unorganized and while there are many nice features in the 1.0 platform, it became more and more difficult to add new features."),Object(i.b)("p",null,"Surveying mobile and web-based applications addressing Tennis and thinking about the limitations of the data model that had emerged as I tinkered, I was inspired to write an article about the need for ",Object(i.b)("a",{parentName:"p",href:"https://medium.com/@TennisVisuals/toss-tennis-open-software-standards-846cf7276962"},"Data Standards in Tennis"),". This article led to my direct involvement with the ITF and a journey into understanding what it would take to create a comprehensive and extensible standard."),Object(i.b)("p",null,"The 2.0 phase of TMX was preceeded by the creation of the ",Object(i.b)("a",{parentName:"p",href:"https://courthive.github.io/tods-competition-factory/"},"Competition Factory"),', which represents all of the knowedge gained during the implementation of TMX 1.0, with the "business logic" extracted from the presentation layer and the old data model being updated to the latest version of TODS.'),Object(i.b)("p",null,"The initial release of TMX 2.0 is very minimal. All of the server interaction has been stripped away and the UI components are unfinished, but it is possible to export tournament records from TMX 1.0 and import them into TMX 2.0."),Object(i.b)("p",null,"The next phase of the project will be to re-write the server components which support TMX, including user authentication, provider configuration, data storage and publishing."))}u.isMDXComponent=!0}}]);