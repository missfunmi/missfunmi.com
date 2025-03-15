<?xml version="1.0" encoding="utf-8"?>
<!--
Based on "Pretty RSS Feed" at https://github.com/genmon/aboutfeeds/issues/26
-->
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"
                xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" data-theme="light">
      <head>
        <title><xsl:value-of select="atom:feed/atom:title"/></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style type="text/css">
          html{font-family:Inter,sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;color:#3e3e3e}body,html{padding:0;margin:0 auto}header,main{padding:2.03rem 5vw}main{flex-grow:1}a[href],a[href]:visited{text-decoration:none;color:#dd72bb}a[href]:hover{color:#6fa2ef}a[target="_blank"]:after{content:" " url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTAiIGZpbGw9IiMzZTNlM2UiIHZpZXdCb3g9IjAgMCAxMCAxMCIgd2lkdGg9IjEwIj4KICA8cGF0aCBkPSJNNi4yNSAwSDUuNjI1ekg1LjYyNXYxLjI1aDIuMjQ2TDMuOTI2IDUuMTc2IDMuNDk2IDUuNjI1bDAuODc5IDAuODc5IDAuNDQ5IC0wLjQzTDguNzUgMi4xMjlWNC4zNzVoMS4yNVYwek0wLjYyNSAwLjYyNUgwekgwdjkuMzc1aDkuNTMxdi0zLjc1aC0xLjI1djIuNUgxLjI1VjEuODc1aDIuNVYwLjYyNXoiLz4KPC9zdmc+Cg==")}a[target="_blank"]:hover:after{content:" " url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTAiIGZpbGw9IiM2ZmEyZWYiIHZpZXdCb3g9IjAgMCAxMCAxMCIgd2lkdGg9IjEwIj4KICA8cGF0aCBkPSJNNi4yNSAwSDUuNjI1ekg1LjYyNXYxLjI1aDIuMjQ2TDMuOTI2IDUuMTc2IDMuNDk2IDUuNjI1bDAuODc5IDAuODc5IDAuNDQ5IC0wLjQzTDguNzUgMi4xMjlWNC4zNzVoMS4yNVYwek0wLjYyNSAwLjYyNUgwekgwdjkuMzc1aDkuNTMxdi0zLjc1aC0xLjI1djIuNUgxLjI1VjEuODc1aDIuNVYwLjYyNXoiLz4KPC9zdmc+Cg==")}header{display:flex;gap:1em;flex-wrap:wrap;justify-content:space-between;background-image:linear-gradient(#ffe8e8 0.05em, transparent 0.03em),linear-gradient(90deg, #ffe8e8 0.05em, #fff 0.08em);background-size:0.5em 0.5em;flex-grow:0;flex-shrink:0}.hero{max-width:70vw}.hero-title{font-size:3em;font-weight:500;line-height:1;margin-left:-0.05em}.hero-subtitle{font-size:1.5em;font-weight:300;color:#757575;padding-top:0.5em}.action-link-container{padding-top:1rem;padding-bottom:1.5rem}a.back-link{font-weight:600}a.back-link:before{content:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTAiIGZpbGw9IiNkZDcyYmIiIHZpZXdCb3g9IjAgMCAxMCAxMCIgd2lkdGg9IjEwIj48cGF0aCBkPSJNMC4yMDEgNC40ODdRMCA0LjcxIDAgNXQwLjIwMSAwLjUxM2w0LjI4NiA0LjI4NlE0LjcxIDEwIDUgMTB0MC41MTMgLTAuMjAxcTAuMjAxIC0wLjIyMyAwLjIwMSAtMC41MTMgMCAtMC4yOSAtMC4yMDEgLTAuNTEzTDEuNzE5IDUgNS41MTMgMS4yMjhRNS43MTQgMS4wMDQgNS43MTQgMC43MTRxMCAtMC4yOSAtMC4yMDEgLTAuNTEzUTUuMjkgMCA1IDB0LTAuNTEzIDAuMjAxek04Ljc3MiAwLjIwMSA0LjQ4NyA0LjQ4N3pMNC40ODcgNC40ODdRNC4yODYgNC43MSA0LjI4NiA1dDAuMjAxIDAuNTEzbDQuMjg2IDQuMjg2UTguOTk2IDEwIDkuMjg2IDEwcTAuMjkgMCAwLjUxMyAtMC4yMDFRMTAgOS41NzYgMTAgOS4yODZxMCAtMC4yOSAtMC4yMDEgLTAuNTEzTDYuMDA0IDUgOS43OTkgMS4yMjhRMTAgMS4wMDQgMTAgMC43MTRxMCAtMC4yOSAtMC4yMDEgLTAuNTEzUTkuNTc2IDAgOS4yODYgMHEtMC4yOSAwIC0wLjUxMyAwLjIwMSIvPjwvc3ZnPg==") " "}a.back-link:hover:before{content:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTAiIGZpbGw9IiM2ZmEyZWYiIHZpZXdCb3g9IjAgMCAxMCAxMCIgd2lkdGg9IjEwIj48cGF0aCBkPSJNMC4yMDEgNC40ODdRMCA0LjcxIDAgNXQwLjIwMSAwLjUxM2w0LjI4NiA0LjI4NlE0LjcxIDEwIDUgMTB0MC41MTMgLTAuMjAxcTAuMjAxIC0wLjIyMyAwLjIwMSAtMC41MTMgMCAtMC4yOSAtMC4yMDEgLTAuNTEzTDEuNzE5IDUgNS41MTMgMS4yMjhRNS43MTQgMS4wMDQgNS43MTQgMC43MTRxMCAtMC4yOSAtMC4yMDEgLTAuNTEzUTUuMjkgMCA1IDB0LTAuNTEzIDAuMjAxek04Ljc3MiAwLjIwMSA0LjQ4NyA0LjQ4N3pMNC40ODcgNC40ODdRNC4yODYgNC43MSA0LjI4NiA1dDAuMjAxIDAuNTEzbDQuMjg2IDQuMjg2UTguOTk2IDEwIDkuMjg2IDEwcTAuMjkgMCAwLjUxMyAtMC4yMDFRMTAgOS41NzYgMTAgOS4yODZxMCAtMC4yOSAtMC4yMDEgLTAuNTEzTDYuMDA0IDUgOS43OTkgMS4yMjhRMTAgMS4wMDQgMTAgMC43MTRxMCAtMC4yOSAtMC4yMDEgLTAuNTEzUTkuNTc2IDAgOS4yODYgMHEtMC4yOSAwIC0wLjUxMyAwLjIwMSIvPjwvc3ZnPg==") " "}.copyright,.publication-date{font-size:smaller}.about-feeds,.copyright,.page-content{max-width:100vw;border-top:1px dashed #28A8FE;margin-top:1em;padding-top:1em}.page-content .page-content-title{font-size:2.5em;font-weight:400;line-height:1;margin-left:-0.02em}.post-clip{padding-top:1rem;padding-bottom:0.5rem}.post-clip .post-metadata{font-size:smaller;color:#b3b3b3}.post-clip .post-title,.post-clip .post-title a[href]{font-size:larger;font-weight:500}.post-clip .post-description{font-weight:400}@media screen and (max-width:600px){.page-content,header{padding-top:1rem;padding-bottom:1rem}.action-link-container,.post-clip{padding-bottom:0}.hero,.page-content,.post-hero{max-width:100vw}.hero-title{font-size:2em}.hero-subtitle{font-size:1em}.page-content .page-content-title{font-size:1.5em}}
        </style>
      </head>

      <body>
        <header>
          <nav>
            <p><strong><xsl:value-of select="atom:feed/atom:title"/></strong></p>
            <p class="publication-date"><strong>Last published: </strong><xsl:value-of select="atom:feed/atom:updated"/>. <a href="http://validator.w3.org/feed/check.cgi?url={/atom:feed/atom:link[not(@rel)]/@href}feed.xml" target="_blank">This is a valid Atom 1.0 feed</a></p>
            <p class="about-feeds publication-date">This is a web feed, also known as an RSS or Atom feed. Subscribe by copying the URL from the address bar into your newsreader. I like <a href="https://feedly.com/" target="_blank">Feedly</a>, but there are plenty of other options. Visit <a href="https://aboutfeeds.com" target="_blank">About Feeds</a> to get started &#x2014; it’s free.</p>
          </nav>
        </header>

        <main>
          <div class="hero">
            <div class="hero-title">Feed Preview</div>
            <div class="hero-subtitle">Here's a sampling of what you'll see in your newsreader. Note that this preview only shows excerpts of the last 15 posts, but the actual feed contains the full content.</div>
          </div>

          <div class="page-content">
            <xsl:apply-templates select="atom:feed/atom:entry" />
          </div>

          <div class="action-link-container">
            <a class="back-link">
              <xsl:attribute name="href">
                <xsl:value-of select="/atom:feed/atom:link[not(@rel)]/@href"/>
              </xsl:attribute>
              back to the website
            </a>
          </div>

          <atom:rights><div class="copyright">
            <p><span class="copyright-maintext">© <strong>2025 Funmi Oludaiye.</strong></span><span class="copyright-subtext"> All rights reserved.</span></p>
          </div></atom:rights>
        </main>

      </body>

    </html>
  </xsl:template>

  <xsl:template match="atom:feed/atom:entry">
    <div class="post-clip">
      <div class="post-title">
        <a>
          <xsl:attribute name="href">
            <xsl:value-of select="atom:link/@href"/>
          </xsl:attribute>
          <xsl:value-of select="atom:title"/>
        </a>
      </div>
      <div class="post-metadata">Published: <xsl:value-of select="atom:updated"/></div>
      <div class="post-clip"><xsl:value-of select="atom:summary"/></div>
    </div>
  </xsl:template>

</xsl:stylesheet>
