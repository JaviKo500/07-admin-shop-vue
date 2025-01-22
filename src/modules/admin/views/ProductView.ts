import { defineComponent } from 'vue';

export default defineComponent({
  setup(){
    console.log('<--------------- JK ProductView --------------->');
    console.log('ProductView');

    return {
      // properties
      // getters
      allSizes: ['XS', 'S', 'M'],
      // actions
    };
  }
});