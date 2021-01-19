---
layout: page
---
<br>
# **Design Archives** is a curated collection of design from the Internet Archive.
<br><br>

<div class="featured-container">
{% for post in site.posts limit:2 %}
<a class="featured-post" href="{{ site.baseurl }}{{ post.url }}">
{% if post.featured-image %}
  <img src="{{ site.baseurl }}/assets/img/{{post.featured-image}}" alt="{{ post.featured-image-alt }}">
{% endif %}

<p style="margin-bottom: 1.25rem;">{{ post.title }}</p>
</a>
{% endfor %}
</div>
<div class="featured-container" style="margin-top:2rem;">
{% for post in site.posts offset:2 limit:2 %}
<a class="featured-post" href="{{ site.baseurl }}{{ post.url }}">
{% if post.featured-image %}
  <img src="{{ site.baseurl }}/assets/img/{{post.featured-image}}" alt="{{ post.featured-image-alt }}">
{% endif %}

<p style="margin-bottom: 1.25rem;">{{ post.title }}</p>
</a>
{% endfor %}
</div>

<div markdown="0"><a href="https://archives.design/latest/" ><div class="featured-btn">See more</div></a></div>