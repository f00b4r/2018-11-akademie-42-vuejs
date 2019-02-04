<template>
    <div class="modal fade" tabindex="-1" ref="modal" role="dialog" @keyup.enter="search">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="lpl-modal-title">Search in application...</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body">
                    <div class="input-group mb-3">
                        <input ref="query" v-model="query" class="form-control form-control-lg" type="text" placeholder="John Doe">
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button" @click.prevent="search">Search</button>
                        </div>
                    </div>
                    <div class="list-group mt-4">
                        <a v-for="(item, key) in items"
                                :key="key"
                                @click.prevent="onItemClick(item)"
                                class="list-group-item list-group-item-action"
                        >
                            <div class="d-flex w-100 justify-content-between">
                                <h5 class="mb-1">
                                    <i v-if="item.icon" :class="item.icon"></i>
                                    {{item.title}}
                                </h5>
                            </div>
                            <p class="mb-1" v-if="item.info">{{item.info}}</p>
                        </a>
                    </div>
                    <p v-if="items !== null && items.length === 0" class="alert alert-warning">
                        No results for <strong>{{lastQuery}}</strong>. Try again.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import $ from "jquery";

    export default {
        props: {
            url: {
                type: String,
                require: true,
            }
        },
        data: () => ({
            query: null,
            lastQuery: null,
            items: null,
        }),
        mounted() {
            $(this.$refs.modal).modal('toggle');
            $(this.$refs.modal).on('hidden.bs.modal', (e) => {
                this.$emit('hide');
            });
            $(this.$refs.modal).on('shown.bs.modal', (e) => {
                this.$refs.query.focus();
            });
        },
        methods: {
            async search() {
                const response = await fetch(`${this.url}?q=${this.query}`);
                this.lastQuery = this.query;

                if (response.status === 200) {
                    const data = await response.json();
                    this.items = data.items;
                }
            },
            onItemClick(item) {
                window.location.href = item.link;
            }
        }
    };
</script>