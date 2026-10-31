export interface Task1Sample {
  id: string;
  title: string;
  visualType: string;
  question: string;
  sampleEssay: string;
  imagePromptDescription?: string;
}

export interface Task2Sample {
  id: string;
  title: string;
  questionType: string;
  question: string;
  sampleEssay: string;
}

export const TASK_1_SAMPLES: Task1Sample[] = [
  {
    id: 'line-graph-fastfood',
    title: 'Fast Food Consumption in the UK (Line Graph)',
    visualType: 'Line Graph',
    question: 'The line graph below shows the consumption of fast food by Australian teenagers from 1975 to 2000 in grams per person per year. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    sampleEssay: `The line graph illustrates the consumption of three types of fast food—pizza, fish and chips, and hamburgers—by teenagers in Australia between 1975 and 2000, measured in grams per person per year.

Overall, it is clear that while fish and chips experienced a significant downward trend over the 25-year period, the consumption of hamburgers and pizza rose dramatically, with pizza becoming the most popular choice by 2000.

In 1975, fish and chips was by far the most heavily consumed fast food, standing at 100 grams. In sharp contrast, hamburgers and pizza were consumed at much lower levels, with pizza at only about 5 grams and hamburgers at around 10 grams. Over the following decade, the intake of fish and chips declined steadily, reaching approximately 85 grams in 1985 before plummeting to around 39 grams in 2000.

Conversely, the popularity of hamburgers and pizza increased rapidly. Pizza consumption surged after 1985, overtaking fish and chips around 1990 and finishing at 82 grams in 2000. Similarly, hamburger consumption escalated consistently throughout the entire timeframe, matching pizza by 1985 and reaching roughly 100 grams by the end of the period, making it the most consumed fast food alongside pizza.`
  },
  {
    id: 'table-internet-users',
    title: 'Internet Access in Five Countries (Table)',
    visualType: 'Table',
    question: 'The table below shows the percentage of households with internet access in five countries between 2000 and 2010. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    sampleEssay: `The table compares the proportion of households having internet access in five different countries—Canada, Germany, Australia, South Korea, and the UK—over a ten-year span from 2000 to 2010.

Overall, all five nations witnessed substantial growth in household internet connectivity over the decade. South Korea consistently maintained the highest penetration rate throughout the period, whereas the UK had the lowest initial percentage but experienced rapid adoption.

In 2000, South Korea was the clear leader with 49% of households connected to the internet, followed by Canada at 42% and Germany at 38%. Australia and the UK trailed behind with 35% and 28% respectively. By 2005, internet adoption had surged across all nations, with South Korea climbing to 72% and Canada reaching 65%.

By 2010, the gap between the countries had narrowed considerably. South Korea remained dominant at 89%, while Germany and Canada reached 82% and 80% respectively. The UK registered the most remarkable increase, rising from 28% to 78%, closely matching Australia's figure of 76%.`
  },
  {
    id: 'process-coffee-production',
    title: 'Coffee Production Stages (Process Diagram)',
    visualType: 'Process Diagram',
    question: 'The diagram illustrates the sequential stages involved in the commercial production and manufacturing of coffee for sale. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    sampleEssay: `The diagram provides an overview of the stages in the industrial process of manufacturing coffee for consumer purchase.

Overall, the process consists of eleven distinct phases, commencing with the harvesting of raw coffee beans and culminating in the packaging and distribution of the finished commercial product.

Initially, ripe coffee beans are hand-picked from coffee plants before being sorted and placed in open drying beds under the sun. Once the beans are thoroughly dried, they are cleaned and depulped in specialized machines. Subsequently, the green beans undergo roasting at controlled temperatures, which develops their characteristic aroma and deep color.

After roasting, the beans are rapidly cooled and fed into a grinding mechanism to produce fine coffee grounds. In the next stage, the ground coffee is brewed with hot water in large vats to extract the liquid coffee essence. This concentrate is then freeze-dried or spray-dried into soluble granules. Finally, the dried coffee granules are weighed, sealed into airtight jars, and transported to retail supermarkets for distribution.`
  },
  {
    id: 'map-town-evolution',
    title: 'Town Development Plan (Map Comparison)',
    visualType: 'Map',
    question: 'The maps show the village of Stockham in 1990 and its planned development for 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    sampleEssay: `The two maps illustrate the architectural and infrastructural changes that occurred in the coastal village of Stockham between 1990 and 2020.

Overall, Stockham underwent extensive modernisation, transforming from a quiet, predominantly rural fishing settlement into a populated residential and recreational community with expanded housing and transportation links.

In 1990, the western part of the village was dominated by agricultural farmland, while a small cluster of residential cottages was located near the northern bay. By 2020, the farmland had been completely replaced by a large modern residential estate accompanied by a local primary school and a shopping parade.

Along the southern coastline, the original small fishing harbour was converted into a marina for yachts and leisure boats. Furthermore, a dual carriageway was constructed running from east to west, connecting the new developments with the main motorway network, thereby enhancing local connectivity.`
  }
];

export const TASK_2_SAMPLES: Task2Sample[] = [
  {
    id: 'opinion-remote-work',
    title: 'Remote Working & Work-Life Balance (Opinion / Agree or Disagree)',
    questionType: 'Opinion',
    question: 'Some people believe that working from home has more disadvantages than advantages for both employees and companies. To what extent do you agree or disagree with this statement?',
    sampleEssay: `In recent years, advancements in digital telecommunications have enabled a significant proportion of the global workforce to operate remotely. While critics argue that telecommuting poses operational hurdles, I completely disagree with the assertion that its disadvantages outweigh its benefits, as remote working enhances employee productivity while reducing corporate overheads.

The primary reason why telecommuting is overwhelmingly advantageous is the substantial improvement in employee wellbeing and efficiency. Commuting in urban environments often consumes several hours daily, resulting in fatigue, financial strain, and reduced discretionary time. By eliminating the daily commute, workers can allocate more time to their families, personal health, and core professional tasks. Furthermore, numerous studies indicate that individuals working in tranquil home environments experience fewer interpersonal distractions than in open-plan offices, enabling deeper concentration and greater creative output.

From the perspective of employers, remote working models offer considerable economic and strategic advantages. Companies that adopt flexible working arrangements can substantially downsize their physical office premises, thereby lowering exorbitant expenditures on commercial rent, utilities, and custodial services. Additionally, businesses are no longer geographically constrained to recruiting local personnel; they can source world-class talent globally, fostering diversity and competitive innovation within their teams.

To conclude, I firmly disagree that remote working is predominantly disadvantageous. The elimination of arduous commutes coupled with substantial corporate cost savings demonstrates that remote work represents a progressive and superior paradigm for the modern economy.`
  },
  {
    id: 'discussion-university-vocational',
    title: 'University Education vs Vocational Skills (Discussion)',
    questionType: 'Discussion',
    question: 'Some people think that universities should focus on providing knowledge and skills for specific careers. Others believe that the true function of a university is to give access to knowledge for its own sake, regardless of whether the course is practical. Discuss both views and give your own opinion.',
    sampleEssay: `The core pedagogical mission of tertiary institutions remains a subject of considerable debate. While one school of thought contends that universities should strictly prepare undergraduates for designated vocations, another argues that academic inquiry should be pursued for intellectual enrichment. In this essay, I will explore both perspectives before explaining why I believe an integrated curriculum offers the most pragmatic approach.

Advocates of career-oriented higher education argue that in an intensely competitive global marketplace, practical skills are paramount. Students invest substantial financial capital and years of their youth into obtaining academic degrees; therefore, they reasonably expect immediate employability upon graduation. In fields such as engineering, medicine, and computer programming, rigorous vocational training directly fulfills the demands of industry, ensuring national economic competitiveness and preventing underemployment among young graduates.

Conversely, proponents of liberal education maintain that universities exist to foster critical reasoning and cultural enlightenment rather than merely serving as corporate training facilities. Exposure to theoretical philosophy, literature, and fundamental scientific principles cultivates adaptable problem-solving skills, ethical discernment, and intellectual curiosity. Throughout history, groundbreaking scientific breakthroughs and societal innovations have frequently stemmed from curiosity-driven exploration rather than immediate commercial imperatives.

In conclusion, although the cultivation of pure intellectual curiosity is vital for human progress, practical employability cannot be disregarded in modern society. In my view, the optimal approach is for universities to combine rigorous foundational knowledge with practical professional competencies, enabling graduates to be both enlightened citizens and capable professionals.`
  },
  {
    id: 'problem-solution-traffic',
    title: 'Urban Traffic Congestion (Problems and Solutions)',
    questionType: 'Problems and Solutions',
    question: 'In many modern cities, traffic congestion is becoming an increasingly severe problem. What are the main causes of this issue, and what measures can governments and individuals take to tackle it?',
    sampleEssay: `Traffic gridlock has emerged as one of the most vexing challenges facing metropolitan centers worldwide. This essay will examine the principal drivers behind this urban dilemma—namely inadequate public transport infrastructure and excessive reliance on private automobiles—and propose viable solutions including state investment in clean transit systems and congestion charging.

The foremost cause of vehicular congestion is the chronic deficiency and unreliability of public mass transit networks. In many developing and developed cities alike, bus and subway systems are overcrowded, infrequent, or poorly integrated with suburban residential zones. Consequently, commuters feel compelled to rely on personal motorcars for their daily travel. This individual reliance is further exacerbated by suburban sprawl, where commercial centers are isolated from residential neighborhoods by distances that cannot be walked or cycled.

To mitigate this worsening crisis, municipal authorities must enact decisive systemic interventions. First, governments should heavily subsidize and modernize comprehensive rapid transit infrastructure, such as electric light rail and dedicated bus lanes, ensuring that public commuting is both faster and more cost-effective than driving. Second, authorities can implement targeted financial disincentives, such as urban congestion charges and heightened parking tariffs in city centers, as successfully demonstrated in London and Singapore. On an individual level, citizens can actively embrace carpooling and cycling for short-distance trips.

To conclude, urban traffic congestion stems primarily from public transit inadequacies and automobile dependence. Through coordinated public infrastructure development and congestion pricing policies, cities can alleviate gridlock and cultivate sustainable living environments.`
  }
];
