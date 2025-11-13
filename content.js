function renderReadingTime(article) {
    // If we weren't provided an article, we don't need to render anything.
    if (!article) {
      return;
    }
    

    // id: #addToCartButtonOrTextIdFor93336522

    // create variable 
    // find selector
    // 

    //const button = document.getElementById(“nav-cart-count”)
    //console.log(cartItems.innerText)
    // #pageBodyContainer > div > div:nth-child(1) > div > div > div:nth-child(10) > div > div > div:nth-child(1) > span.h-text-red > span
    /*
    */


    const cartButton = document.getElementById("addToCartButtonOrTextIdFor93336522")
    if (cartButton) {
        cartButton.addEventListener("click", () => {
          // add code to trigger popup in extension
            alert("Add Cart clicked!");
        });
      }

      const itemPrice = document.querySelector(
        "#pageBodyContainer > div > div:nth-child(1) > div > div > div:nth-child(10) > div > div > div:nth-child(1) > span.h-text-red > span"
      );

      alert(itemPrice.innerText);


//     const button="#addToCartButtonOrTextIdFor93336522"
//     const text = article.textContent;
//     const wordMatchRegExp = /[^\s]+/g; // Regular expression
//     const words = text.matchAll(wordMatchRegExp);
//     // matchAll returns an iterator, convert to array to get word count
//     const wordCount = [...words].length;
//     const readingTime = Math.round(wordCount / 200);
//     const badge = document.createElement("p");
//     // Use the same styling as the publish information in an article's header
//     badge.classList.add("color-secondary-text", "type--caption");
//     badge.textContent = `⏱️ ${readingTime} min read`;
  
//     // Support for API reference docs
//     const heading = article.querySelector("h1");
//     // Support for article docs with date
//     const date = article.querySelector("time")?.parentNode;
  
//     (date ?? heading).insertAdjacentElement("afterend", badge);
//   }
  
//   renderReadingTime(document.querySelector("article"));