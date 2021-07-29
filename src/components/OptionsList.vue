<template>
  <v-row align="center" class="list px-3 mx-auto mt-10">
    <v-col cols="12" sm="12">
      <v-card class="mx-auto" tile>

        <v-data-table
            :headers="headers"
            :items="options"
            class="elevation-1"
            @idChange="changeId"
        >
          <template v-slot:top>

            <v-toolbar flat height="100">

              <v-dialog
                  v-model="dialog"
                  max-width="500px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-container>
                    <v-row>
                      <SelectAccount></SelectAccount>

                      <v-col class="text-right" cols="4">
                        <v-btn
                            color="primary"
                            dark
                            class="mb-2"
                            v-bind="attrs"
                            v-on="on"
                        >
                          New Item
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-container>

                </template>


                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col
                            cols="12"
                            sm="6"
                            md="4"
                        >
                          <v-text-field
                              v-model="editedItem.platformName"
                              label="Platform Name"
                          ></v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                            md="4"
                        >
                          <v-text-field
                              v-model="editedItem.optionName"
                              label="Option Name"
                          ></v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                            md="4"
                        >
                          <v-text-field
                              v-model="editedItem.optionValue"
                              label="Option Value"
                          ></v-text-field>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                            md="4"
                        >
                          <v-text-field
                              v-model="editedItem.dotDigitalId"
                              label="DOT Digital ID"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
                small
                @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn
                color="primary"
                @click="initialize"
            >
              Reset
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import OptionsDataService from '../services/OptionsDataService';
  import SelectAccount from "@/components/SelectAccount";
  export default {
    components: {SelectAccount},
    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'Platform Name', align: 'start', sortable: false, value: 'platformName' },
        { text: 'Option Name', value: 'optionName', sortable: false },
        { text: 'Option Value', value: 'optionValue', sortable: false },
        { text: 'DOT Digital ID', value: 'dotDigitalId', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },

      ],
      options: [],
      editedIndex: -1,
      editedItem: {
        platformName: '',
        optionName: '',
        optionValue: '',
        dotDigitalId: '',
        googleId: '',
        rooftopGoogleOptionId: ''

      },
      defaultItem: {
        platformName: '',
        optionName: '',
        optionValue: '',
        dotDigitalId: '',
        googleId: '',
        rooftopGoogleOptionId: ''
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: {

      dialog (val) {
        val || this.close();
      },
      dialogDelete (val) {
        val || this.closeDelete();
      },

    },

    created () {
      this.initialize();
    },

    methods: {
      changeId(id) {
        this.initialize(id);
      },
      initialize (id) {
        OptionsDataService.getAll(id)
            .then((resp) => {
              this.options = resp.data.data.map(this.displayOption);
            })
            .catch((e) => {
              console.error(e);
            })
      },
      editItem (opt) {
        this.editedIndex = this.options.indexOf(opt);
        this.editedItem = Object.assign({}, opt);
        this.dialog = true;
      },

      deleteItem (opt) {
        this.editedIndex = this.options.indexOf(opt);
        this.editedItem = Object.assign({}, opt);
        this.dialogDelete = true;
      },

      deleteItemConfirm () {
        this.options.splice(this.editedIndex, 1);
        this.closeDelete();
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        })
      },

      closeDelete () {
        this.dialogDelete = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.options[this.editedIndex], this.editedItem);
          // update
        } else {

            /*
            OptionsDataService.create(this.editedItem)
                .then((resp) => {
                  console.log(resp);
                  this.options.push(this.editedItem);
                })
                .catch((e) => {
                  console.error(e);
                })

          }

          this.close();
          */
        }
      },

      displayOption(opt) {
        return {
          platformName: opt.platformName,
          optionName: opt.optionName,
          optionValue: opt.optionValue,
          dotDigitalId: opt.dotDigitalId,
          googleId: opt.googleId,
          rooftopGoogleOptionId: opt.rooftopGoogleOptionId
        }
      }
    }
  }
</script>

<style>
  .list {
    max-width: 1024px;
  }
</style>
