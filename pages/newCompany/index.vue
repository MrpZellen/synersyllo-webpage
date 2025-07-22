<template>
  <div class="min-h-100">
    <SurveyComponent :model="survey" />
  </div>
</template>

<script lang="ts" setup>
import { SurveyComponent } from 'survey-vue3-ui';
import 'survey-core/survey-core.css';
import { Model } from 'survey-core';
import { generateRandomID } from '~/server/utils/stringGenerator';
import { industryDropdownChoices } from '~/models/choices';

const surveyModel = {
  pages: [{
    title: 'Company Info',
    elements: [
    {
      name: "companyInfo.name",
      title: "What's the name of your company?",
      type: 'text',
      isRequired: true
    },
    {
      name: "companyInfo.industry",
      title: "What industry is your company in?",
      type: "dropdown",
      choices: industryDropdownChoices,
    },
    {
      name: "companyInfo.size",
      title: "How many people are in your company?",
      type: "number",
      inputType: "number",
      min: 1,
      isRequired: true
    }, 
    {
      name: "website",
      title: "What is your company website?",
      type: "text",
      inputType: "url"
    }
  ]}, {
    title: 'Company Location',
   elements: [
    {
      name: "companyInfo.localization.city",
      title: "Which city is your company based in?",
      type: "text"
    },
    {
      name: "companyInfo.localization.state",
      title: "Which state is your company based in? (optional)",
      type: "text"
    },
    {
      name: "companyInfo.localization.postzip",
      title: "ZIP or postal code?",
      type: "text",
      inputType: "text"
    },
    {
      name: "companyInfo.localization.timezone",
      title: "Your company’s time zone (e.g. EST, PST)?",
      type: "text"
    }
   ]}, {
    title: 'Bob Details',
   elements: [
    {
      name: "bobInfo.specifications.tone",
      title: "Describe BOB's tone",
      type: "text",
      description: "Example: serious, corporate family, parody, etc."
    },
    {
      name: "bobInfo.specifications.description",
      title: "How descriptive should BOB be? (1–10)",
      type: "rating",
      rateMin: 1,
      rateMax: 10,
      minRateDescription: "Very brief",
      maxRateDescription: "Very detailed"
    },
    {
      name: "bobInfo.specifications.avoid",
      title: "What phrases or behaviors should BOB avoid?",
      type: "comment",
      description: "List anything BOB should never say or do (comma or line separated)"
    }
   ]
  }, {
    title: 'Company Roles',
    elements: [
      {
      name: "companyRoles",
      title: "What are the roles in your company? (these will start as your groups!)",
      type: "comment",
      description: "List any role at your company, separate by commas!"
    }
    ]
  }]
}

const surveyComplete = (survey: any) => {
  console.log('hi, we did surveys')
  const companyID = 'COM-' + generateRandomID(9)
  console.log('generatedNum')
  survey.setValue("companyID", companyID);
  console.log('value set')
  const results = defineSurveySchema(survey)
  console.log('schema defined')

  //call api to save company scheme
  companyReturn(JSON.parse(JSON.stringify(results)))
}

const survey = new Model(surveyModel)
survey.onComplete.add(surveyComplete)

//NOW WE MOVE THE DATA:
const SURVEY_ID = 1 

const companyReturn = async (results: any) => { 
  console.log('we go')
  const result = await $fetch('/api/company/createCompany', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(results)
  });
  if(result){
    console.log("success! Company Added")
    //do stuff when company added, redirect and guide to main user login.
  } else {
    console.error("something went wrong! add failed.")
  }
}

const defineSurveySchema = (survey: any) => {
  var toneItem, avoidItem, companyItem = []
  if(survey.data.bobInfo.specifications.tone){
    toneItem = survey.data.bobInfo.specifications.tone.split(',');
  }
  if(survey.data.bobInfo.specifications.avoid){
    avoidItem = survey.data.bobInfo.specifications.avoid.split(',');
  }
  if(survey.data.companyRoles){
    companyItem = survey.data.companyRoles.split(',');
  }
  console.log('lets make the guy')
  const finalCompany = {
    companyID: survey.data.companyID,
    companyInfo: {
      name: survey.data.companyInfo.name,
      industry: survey.data.companyInfo.industry,
      size: survey.data.companyInfo.size,
      localization: {
        city: survey.data.companyInfo.localization.city,
        state: survey.data.companyInfo.localization.state,
        postzip: survey.data.companyInfo.localization.postzip,
        timezone: survey.data.companyInfo.localization.timezone,
      }
    },
    bobInfo: {
      bobInstanceID: 'BOB-' + generateRandomID(9),
      specifications: {
        tone: toneItem ?? [],
        description: survey.data.bobInfo.specifications.description,
        avoid: avoidItem ?? [],
      }
    },
    adminAccounts: [],
    website: survey.data.website,
    companyRoles: companyItem ?? []
  }
  console.log('guy made')
  return finalCompany
}
</script>

<style>

</style>