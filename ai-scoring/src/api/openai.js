import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
    organization: "org-UuYHj2K6PxiPyA2uoSAVee2B"
});


export async function analyzeImage(imageFile, prompt, handleSetDataChunk, setLoading, loading) {
  console.log(imageFile)
    const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
        {
          "role": "user",
          "content": [
            {"type": "text", "text": prompt},
          ...imageFile
          ],
        }
      ],
      stream: true,

   
    });
    let data = ''

         
    for await (const chunk of response) {
      data = data +  chunk.choices[0]?.delta?.content
      handleSetDataChunk( chunk.choices[0]?.delta?.content || "");
      if(!loading) {

          setLoading(false)
      }
  }
  return ''
    }
export const  generateReviewAnalysis = async (reviews, handleSetDataChunk, setLoading, loading) => {
    console.log({reviews})

    try {
        const completion = await openai.chat.completions.create({
            messages: [{"role": "system", "content": "You are a airbnb property reviews sentiment analysis"},
                {"role": "user", "content": `Analyse the following review data (javascript object) Reviews: ${ JSON.stringify(reviews)}.

                Identify:

                Overall sentiment (positive, negative, or neutral) and consistency with ratings provided. Highlight any discrepancies (e.g., positive review with low rating).
                Common positive themes mentioned in the reviews (e.g., clean room, friendly staff).
                Common negative issues mentioned in the reviews (e.g., noisy location, slow service).
                A detailed summary of the guests' overall experience based on the identified themes and issues.


                Output:
                The results should be a well-formatted Markdown document with the following sections:

                Overall Sentiment:
                Briefly describe the overall sentiment of the reviews (positive, negative, or neutral). Mention any inconsistencies between sentiment and ratings.
                Positive Themes:
                List the most common positive themes mentioned in the reviews, using clear and concise language.
                Negative Issues:
                List the most common negative issues mentioned in the reviews, using clear and concise language.
                Guest Experience Summary:
                Provide a comprehensive summary of the guests' overall experience, incorporating the identified themes and issues.

                Example format:

Markdown
## **Overall Sentiment:**


---

## **Positive Themes:**

* Clean rooms
* Friendly staff
* ... (other themes)



## **Negative Issues:**


* Noisy location
* Slow service
* ... (other issues)

## **Guest Experience Summary:**

... (Summarize guest experience based on themes and issues)
Use code with caution.
content_copy
Please note:

Use proper Markdown syntax for headings (##) and bullet points (*).
Focus on clear and concise communication in the summary.
Maintain a well-structured format for readability.

    
                  `},
    ],
            model:  'gpt-4-turbo',
            stream: true
          });

          let data = ''

         
          for await (const chunk of completion) {
            data = data +  chunk.choices[0]?.delta?.content
            handleSetDataChunk( chunk.choices[0]?.delta?.content || "");
            if(!loading) {

                setLoading(false)
            }
        }

          return ''
    } catch (error) {
        console.log(error)
    }
  
}

